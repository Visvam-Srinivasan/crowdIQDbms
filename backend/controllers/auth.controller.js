// controllers/auth.controller.js
const db = require('../config/db.config');

// Helper function to insert user data into role-specific table
const insertRoleSpecificUser = (role, userData) => {
    return new Promise((resolve, reject) => {
        let query;
        let values;

        switch (role) {
            case 'admin':
                query = 'INSERT INTO admins (email, password, admin_code, name) VALUES (?, ?, ?, ?)';
                values = [userData.email, userData.password, userData.adminCode, userData.fullName];
                break;
            case 'staff':
                query = 'INSERT INTO staffs (email, password, staff_code, name) VALUES (?, ?, ?, ?)';
                values = [userData.email, userData.password, userData.staffCode, userData.fullName];
                break;
            case 'attendee':
                query = 'INSERT INTO attendees (email, password, ticket_id, name) VALUES (?, ?, ?, ?)';
                values = [userData.email, userData.password, userData.fullName, userData.ticketId, userData.fullName];
                break;
        }

        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

exports.registerUser = async (req, res) => {
    const { email, password, role, ...rest } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    if (!['admin', 'staff', 'attendee'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        // Check if the email is already taken in the role-specific table
        const emailCheckQuery = `SELECT * FROM ${role}s WHERE email = ?`;
        db.query(emailCheckQuery, [email], async (err, emailCheckResult) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking email', error: err });
            }

            if (emailCheckResult && emailCheckResult.length > 0) {
                return res.status(409).json({ message: 'Email already exists for this role' });
            }

            // Role-specific data
            const roleSpecificData = { email, password };

            switch (role) {
                case 'admin':
                    roleSpecificData.adminCode = rest.adminCode;
                    break;
                case 'staff':
                    roleSpecificData.staffCode = rest.staffCode;
                    break;
                case 'attendee':
                    roleSpecificData.fullName = rest.fullName;
                    roleSpecificData.ticketId = rest.ticketId;
                    break;
            }

            try {
                await insertRoleSpecificUser(role, roleSpecificData);
                res.status(201).json({ message: 'User registered successfully' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Registration failed', error });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed', error });
    }
};

exports.loginUser = (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    const query = `SELECT ${role}_id AS id, name, email FROM ${role}s WHERE email = ? AND password = ?`;
    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error during login', error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];
        res.json({ message: 'Login successful', user });
    });
};

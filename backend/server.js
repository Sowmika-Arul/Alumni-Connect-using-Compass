require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(cors()); 
const upload = multer({ dest: 'uploads/' });

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const dbURI = process.env.MONGODB_URI;

// Define schemas and models
const userSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'login' });

const adminSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'Admin_Login' });

const profileSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },
    name: { type: String },
    batch: { type: String },
    department: { type: String },
    specialization: { type: String },
    location: { type: String },
    industry: { type: String },
    photo: {type: String},
    email: {type: String},
}, { collection: 'Alumni_Profile' });

const informationSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    phoneNumber: { type: String },
    linkedIn: { type: String },
    github: { type: String },
    leetcode: { type: String },
    achievements: { type: String },
    successStory: { type: String },
    pictures: [{ url: { type: String }, }]
}, { collection: 'Information' });

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Profile = mongoose.model('Profile', profileSchema);
const Information = mongoose.model('Information', informationSchema);

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Login route
app.post('/login', async (req, res) => {
    const { rollNo, password } = req.body;

    try {
        let user = await User.findOne({ rollNo, password });

        if (user) {
            return res.status(200).json({ message: 'Login successful', rollNo });
        }

        let admin = await Admin.findOne({ rollNo, password });

        if (admin) {
            return res.status(200).json({ message: 'Admin login successful', rollNo });
        }

        res.status(401).json({ message: 'Invalid roll number or password' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

// Fetch alumni profiles
app.get('/alumni_list', async (req, res) => {
    try {
        const profiles = await Profile.find({});
        res.status(200).json({ profiles });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

// Fetch user profile by roll number
app.get('/profile/:rollNo', async (req, res) => {
    const { rollNo } = req.params;

    try {
        const profile = await Profile.findOne({ rollNo });

        if (profile) {
            res.status(200).json({ profile });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

// Update profile by roll number
app.put('/profile/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    const updateData = req.body;

    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { rollNo },
            updateData,
            { new: true, runValidators: true }
        );

        if (updatedProfile) {
            res.status(200).json({ profile: updatedProfile });
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'An error occurred', error: err.message });
    }
});

app.post('/add_information', upload.array('pictures', 10), async (req, res) => {
    try {
        const { rollNo, phoneNumber, linkedIn, github, leetcode, achievements, successStory } = req.body;
        const pictures = req.files.map(file => {
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join('uploads', fileName);
            return { url: filePath };
        });

        // Validate rollNo presence
        if (!rollNo) {
            return res.status(400).json({ message: 'Roll number is required' });
        }

        const information = new Information({
            rollNo,
            phoneNumber,
            linkedIn,
            github,
            leetcode,
            achievements,
            successStory,
            pictures,
        });

        await information.save();
        res.status(200).json({ message: 'Information added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add information' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

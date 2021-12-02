const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
]

// HTTP Get Request
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// HTTP Post Request
app.post('/api/courses', (req, res) => {
    // Input Validation for a post request
    // Using helper function
    const { error } = validateCourse(req.body);     // Object Destructuring
    if(error) {
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    }

    // post request to make a new course
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


// HTTP Put request
app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))      //find a course 'c' such that c.id === req.params.id
    if(!course) return res.status(404).send('The course with the given ID was not found');

    // Validate
    // If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body);     // Object Destructuring
    if(error) {
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    }

    course.name = req.body.name;
    res.send(course);
});

// HTTP Delete Request
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // Not exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))      //find a course 'c' such that c.id === req.params.id
    if(!course) return res.status(404).send('The course with the given ID was not found');

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}


// /api/courses/1
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))      //find a course 'c' such that c.id === req.params.id
    if(!course) return res.status(404).send('The course with the given ID was not found');
    res.send(course);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
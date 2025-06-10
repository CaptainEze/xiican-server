// test seeder file
import User from "./models/user"

const users = [
    {username: 'testuser1', password: 'jdkkdkdkdk'},
    {username: 'testuser2', password: 'jdkkdkdkdk'},
    {username: 'testuser3', password: 'jdkkdkdkdk'},
    {username: 'testuser4', password: 'jdkkdkdkdk'},
    {username: 'testuser5', password: 'jdkkdkdkdk'}
]

users.forEach(async (user) => {
    const newUser = new User({
        userName: user.username,
        password: user.password
    });
    await newUser.save();
});
console.log("Users seeded successfully");
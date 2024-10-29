require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
require('./database/mongoose');
const Course = require('./database/Models/Courses');

const token = `${process.env.BOT_TOKEN}`;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || 'User';
    const text = msg.text.toLowerCase();

    if (text.trim() === '/start') {
        bot.sendMessage(chatId, `Hello, ${username}!\n. Text /help to discover our documentation`);
    }
    else if (text.includes('hello')) {
        bot.sendMessage(chatId, `Hello, ${username}!`);
    }
    else if (text.includes('/help')) {
        bot.sendMessage(chatId, `We are currenly new And Don't have many couses to suggest. But u can add your favourite courses so that we can suggest them to others . Here is our documentation:\n\n1. /start - Start\n
       2. /add - You can add in the given format /add title:what course is about(javascript) [blank space] courselink\n
       3. /courseName - You are request a course suggestion eg /courseName name_of_course`);
    } else if (text.startsWith('/add')) {
        try {
            const courseData = text.replace('/add', '').trim();
            const [title, courseLink] = courseData.split(/\s(.+)/);

            if (!title || !courseLink) {
                return bot.sendMessage(chatId, "Please use the correct format: /add title: course name course link");
            }

            let existingCourse = await Course.findOne({ CourseName: title });

            if (existingCourse) {
                if (!existingCourse.CourseList.includes(courseLink)) {
                    existingCourse.CourseList.push(courseLink);
                    await existingCourse.save();
                    bot.sendMessage(chatId, `Course link added to existing course "${title}" successfully!`);
                } else {
                    bot.sendMessage(chatId, `Course link added to existing course "${title}" successfully!`);
                }
            }
            else {
                const newCourse = new Course({ CourseName: title, CourseList: [courseLink] });
                await newCourse.save();
                bot.sendMessage(chatId, `Course "${title}" added successfully!`);
            }
        } catch (e) {
            bot.sendMessage(chatId, "There was an error adding the course. Maybe format is not correct.");
        }
    } else if (text.startsWith('/coursename')) {
        const courseName = text.replace('/coursename', '').trim();

        let existingCourse = await Course.findOne({ CourseName: courseName });

        if (existingCourse) {
            existingCourse.CourseList.forEach((courseLink) => {
                bot.sendMessage(chatId, `${courseLink}`);
            });
        } else {
            bot.sendMessage(chatId, "we don't have that in our database");
        }
    } else {
        bot.sendMessage(chatId, "Refer to our documentation /help");
    }
});
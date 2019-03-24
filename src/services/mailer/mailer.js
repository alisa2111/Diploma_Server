import nodemailer from 'nodemailer'
import {User} from '../../api/user/userController'

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'clearmoney.admn@gmail.com',
    pass: 'Clearmoney1!'
  }
});

export const sendInviteEmail = (invite) =>
  new Promise((resolve, reject) => {
    getPathFor(invite)
      .then(path => {
        const link = `http://localhost:3000/${path}?invite=${invite.id}`;
        const mailOptions = {
          from: 'Clear Money :)',
          to: invite.email,
          subject: 'Приглашение в аккаунт',
          html: '<a href="' + link + '">Принять</a>'
        };
        mailer.sendMail(mailOptions, (err, info) => {
          if (err) {
            reject();
          } else {
            resolve(info);
          }
        });
      });
  });

const getPathFor = (invite) =>
  User.findOne({email: invite.email})
    .then(user => user ? "auth" : "sign-up");


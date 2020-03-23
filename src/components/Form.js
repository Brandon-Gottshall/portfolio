import React from 'react'
import '../styles/form.css'

export default function form() {
    const styles = {
        container: {

        }
    }
    return (
        <div>
            <form id="fs-frm" name="simple-contact-form" accept-charset="utf-8" action="https://formspree.io/brandon@gottshall.dev" method="post">
            <fieldset id="fs-frm-inputs">
            <label for="full-name">Full Name</label>
            <input type="text" name="name" id="full-name" placeholder="First and Last" required=""/>

            <label for="email-address">Email Address</label>
        <input type="email" name="_replyto" id="email-address" placeholder="yourEmail@email.com" required=""/>

            <label for="message">Message</label>
            <textarea rows="5" name="message" id="message" placeholder="Please type your message here." required=""></textarea>
            <input type="hidden" name="_subject" id="email-subject" value="Contact Form Submission"/>

            </fieldset>
            <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}

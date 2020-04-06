import React, { useState } from 'react'
import '../styles/form.css'

export default function Form() {
    const [status, setStatus] = useState('')

    function submitForm(ev) {
      ev.preventDefault();
      const form = ev.target;
      const data = new FormData(form);
      const xhr = new XMLHttpRequest();
      xhr.open(form.method, form.action);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
          form.reset()
          setStatus("SUCCESS")
        } else {
          setStatus("ERROR")
        }
      };
      xhr.send(data);
    }
    return (
        <div>
        <form
          onSubmit={submitForm}
          action="https://formspree.io/brandon@gottshall.dev"
          method="POST"
          id="fs-frm"
          name="simple-contact-form"
          accept-charset="utf-8">

            <fieldset id="fs-frm-inputs">
            <label for="full-name">Full Name</label>
            <input type="text" name="name" id="full-name" placeholder="First and Last" required=""/>

            <label for="email-address">Email Address</label>
        <input type="email" name="_replyto" id="email-address" placeholder="yourEmail@email.com" required=""/>

            <label for="message">Message</label>
            <textarea rows="5" name="message" id="message" placeholder="Please type your message here." required=""></textarea>
            <input type="hidden" name="_subject" id="email-subject" value="Contact Form Submission"/>

            </fieldset>
            {status === "SUCCESS" ? <p>Thanks!</p> : <button>Submit</button>}
            {status === "ERROR" && <p>Ooops! There was an error.</p>}
            </form>
        </div>
    )
}

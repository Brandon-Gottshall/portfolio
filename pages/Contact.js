import PhoneInput from 'react-phone-number-input/input'
import { useState } from 'react'

function Contact () {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [inquiry, setInquiry] = useState('')
  const [submitStatus, setSubmitStatus] = useState('')
  const submitButtonStyles = {
    // style: ['Message text', 'Tailwind CSS'']
    '': ['', 'hidden'],
    error: ['Error! Please try again.', 'text-red-500'],
    errorNoEmailOrPhone: ['Error! Please input Email and/or Phone Number', 'text-red-500'],
    success: ['Success! Message has been sent.', 'text-1xl']
  }
  async function submitHelper (event) {
    event.preventDefault()
    const formData = {
      email: event.target.email.value,
      phoneNumber: event.target.tel.value,
      inquiry: event.target.inquiry.value
    }
    console.log(formData)
    if ((formData.email || formData.phoneNumber) && formData.inquiry) {
      const res = await fetch('/api/sendEmail', { // eslint-disable-line no-undef
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        mode: 'no-cors', // TODO: remove this
        credentials: 'same-origin',
        body: JSON.stringify(formData)
      }).then(res => res.json()).catch(err => {
        console.log(`Error from submitHelper: ${JSON.stringify(err, null, 2)}`)
      })
      setSubmitStatus('success')
      console.log(`Response from submitHelper: ${JSON.stringify(res, null, 4)}`)
    } else if (!formData.email && !formData.phoneNumber) {
      setSubmitStatus('errorNoEmailOrPhone')
    }
  }
  return (
    <div className='flex flex-col items-center justify-center w-full min-h-full'>
      <h3 className='text-2xl font-thin text-red-500 translate-x-0 transform-gpu sm:text-3xl animate-fade-in-from-left'>Contact Me</h3>
      <form onSubmit={submitHelper} className='flex flex-col items-center w-full h-full mt-8'>
        <div className='flex flex-col items-center justify-center mb-8 sm:flex-row'>
          <div className='flex flex-col items-center justify-center'>
            <label htmlFor='email' className='h-8 text-xl font-thin'>Email Address</label>
            <input
              id='email'
              name='email'
              type='email'
              className='w-full h-8 border-2 border-gray-600 rounded-lg'
              value={email}
              onChange={e => setEmail(e.value)}
            />
          </div>
          <div className='h-8 pt-2 mx-8 my-4'>
            <p className='text-xl italic font-thin'>And / Or</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <label htmlFor='tel' className='h-8 text-xl font-thin'>Phone Number</label>
            <PhoneInput
              withCountryCallingCode={false}
              country='US'
              id='tel'
              name='tel'
              type='text'
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.value)}
              className='w-full h-8 border-2 border-gray-600 rounded-lg'
            />
          </div>
        </div>
        <div className='flex flex-col items-center justify-center w-full h-1/2'>
          <label htmlFor='text' className='text-xl font-thin'>Your Message</label>
          <textarea
            id='inquiry'
            name='inquiry'
            type='textArea'
            className='w-2/3 h-64 p-2 mb-4 text-left border-2 border-gray-600 rounded-lg outline-none'
            value={inquiry}
            onChange={e => setInquiry(e.value)}
            required
          />
        </div>
        <p className={submitButtonStyles[submitStatus][1]}>{submitButtonStyles[submitStatus][0]}</p>
        <button type='submit' className='inline-flex items-center justify-center w-24 h-12 py-1 mt-2 mb-6 text-base text-center text-white transition duration-500 ease-in-out bg-red-500 border-0 rounded whitespace-nowrap focus:outline-none hover:bg-black md:mt-0'>Submit</button>
      </form>
    </div>
  )
}

export default Contact

import { useFormik } from 'formik'
import PhoneInput from 'react-phone-number-input/input'

function Contact () {
  const formik = useFormik({
    initialValues: {
      email: '',
      number: '',
      inquiry: ''
    },
    onSubmit: async values => {
      await submitHelper(values)
    },
    enableReinitialize: true
  })

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-full mt-60'>
      <h1 className='text-2xl text-red-500'>Contact Me</h1>
      <form onSubmit={formik.handleSubmit} className='flex flex-col items-center w-full h-full mt-8'>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex flex-col items-center justify-center'>
            <label htmlFor='email' className='text-xl font-thin'>Email Address</label>
            <input
              id='email'
              name='email'
              type='email'
              className='w-full p-2 mb-4 border-2 border-gray-600 rounded-lg'
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <label htmlFor='tel' className='text-xl font-thin'>Phone Number</label>
            <PhoneInput
              withCountryCallingCode={false}
              country='US'
              id='tel'
              name='tel'
              type='text'
              className='w-full p-2 mb-4 border-2 border-gray-600 rounded-lg'
              onChange={e => formik.setFieldValue('number', e)}
              value={formik.values.number}
            />
          </div>
        </div>
        <div className='flex flex-col items-center justify-center w-full h-1/2'>
          <label htmlFor='text' className='text-xl font-thin'>Inquiry</label>
          <input
            id='inquiry'
            name='inquiry'
            type='textArea'
            className='w-2/3 h-full p-2 mb-4 border-2 border-gray-600 rounded-lg'
            onChange={formik.handleChange}
            value={formik.values.inquiry}
          />
        </div>
        <button type='submit' className='inline-flex items-center justify-center w-24 h-12 py-1 mt-24 text-base text-center text-white transition duration-500 ease-in-out bg-red-500 border-0 rounded whitespace-nowrap focus:outline-none hover:bg-black md:mt-0'>Submit</button>
      </form>
    </div>
  )
}

export default Contact

async function submitHelper ({ email, number, inquiry }) {
  console.log({ source: 'submitHelper', email, number, inquiry })
  const res = await fetch('/api/sendEmail', { // eslint-disable-line no-undef
    method: 'POST',
    mode: 'no-cors', // TODO: remove this
    credentials: 'same-origin',
    body: JSON.stringify({ email, number, inquiry })
  }).then(res => res.json())
  // }).catch(err => {
  //   console.log(`Error from submitHelper: ${JSON.stringify(err, null, 2)}`)
  // })
  console.log(`Response from submitHelper: ${JSON.stringify(res, null, 4)}`)
}

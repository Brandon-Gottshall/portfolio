import { useFormik } from 'formik'
import PhoneInput from 'react-phone-number-input/input'

function Contact () {
  const formik = useFormik({
    initialValues: {
      email: '',
      number: '',
      inquiry: ''
    },
    onSubmit: values => {
      console.log(JSON.stringify(values, null, 2))
    }
  })
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-full mt-60'>
      <h1 className='text-2xl text-red-500'>Contact Me</h1>
      <form onSubmit={formik.handleSubmit} className='flex flex-col items-center w-full h-full mt-8'>
        <div className='flex items-center justify-center space-x-6'>
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
          <h1 className='text-xl font-thin'>And / Or</h1>
          <div className='flex flex-col items-center justify-center'>
            <label htmlFor='tel' className='text-xl font-thin'>Phone Number</label>
            <PhoneInput
              placeholder='Enter phone number'
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
          <textArea
            id='inquiry'
            name='inquiry'
            type='text'
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

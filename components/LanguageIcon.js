const iconsEnum = {
  'Next.js': (iconStyle) => <NextJSIcon iconStyle={iconStyle} />,
  React: (iconStyle) => <ReactIcon iconStyle={iconStyle} />,
  Tailwind: (iconStyle) => <TailwindIcon iconStyle={iconStyle} />,
  JS: (iconStyle) => <JSIcon iconStyle={iconStyle} />,
  'React Native': (iconStyle) => <ReactNativeIcon iconStyle={iconStyle} />,
  Flutter: (iconStyle) => <FlutterIcon iconStyle={iconStyle} />,
  Dart: (iconStyle) => <DartIcon iconStyle={iconStyle} />,
  Ruby: (iconStyle) => <RubyIcon iconStyle={iconStyle} />,
  Rails: (iconStyle) => <RailsIcon iconStyle={iconStyle} />,
  'Vercel Serverless Functions': (iconStyle) => <VercelIcon iconStyle={iconStyle} />,
  'Vercel Hosting': (iconStyle) => <VercelInvertIcon iconStyle={iconStyle} />
}
export const iconList = Object.keys(iconsEnum)
export function LanguageIcon ({ iconName, iconStyle }) {
  return (iconsEnum[iconName](iconStyle))
}
function FlutterIcon ({ iconStyle }) {
  return (
    <svg className={iconStyle} viewBox='0 0 128 128'>
      <path fill='#3FB6D3' d='M12.3 64.2L76.3 0h39.4L32.1 83.6zM76.3 128h39.4L81.6 93.9l34.1-34.8H76.3L42.2 93.5z' />
    </svg>
  )
}
function JSIcon ({ iconStyle }) {
  return (
    <svg className={iconStyle} viewBox='0 0 128 128'>
      <path fill='#83CD29' d='M112.771 30.334L68.674 4.729c-2.781-1.584-6.402-1.584-9.205 0L14.901 30.334C12.031 31.985 10 35.088 10 38.407v51.142c0 3.319 2.084 6.423 4.954 8.083l11.775 6.688c5.628 2.772 7.617 2.772 10.178 2.772 8.333 0 13.093-5.039 13.093-13.828v-50.49c0-.713-.371-1.774-1.071-1.774h-5.623C42.594 41 41 42.061 41 42.773v50.49c0 3.896-3.524 7.773-10.11 4.48L18.723 90.73c-.424-.23-.723-.693-.723-1.181V38.407c0-.482.555-.966.982-1.213l44.424-25.561c.415-.235 1.025-.235 1.439 0l43.882 25.555c.42.253.272.722.272 1.219v51.142c0 .488.183.963-.232 1.198l-44.086 25.576c-.378.227-.847.227-1.261 0l-11.307-6.749c-.341-.198-.746-.269-1.073-.086-3.146 1.783-3.726 2.02-6.677 3.043-.726.253-1.797.692.41 1.929l14.798 8.754a9.294 9.294 0 004.647 1.246c1.642 0 3.25-.426 4.667-1.246l43.885-25.582c2.87-1.672 4.23-4.764 4.23-8.083V38.407c0-3.319-1.36-6.414-4.229-8.073zM77.91 81.445c-11.726 0-14.309-3.235-15.17-9.066-.1-.628-.633-1.379-1.272-1.379h-5.731c-.709 0-1.279.86-1.279 1.566 0 7.466 4.059 16.512 23.453 16.512 14.039 0 22.088-5.455 22.088-15.109 0-9.572-6.467-12.084-20.082-13.886-13.762-1.819-15.16-2.738-15.16-5.962 0-2.658 1.184-6.203 11.374-6.203 9.105 0 12.461 1.954 13.842 8.091.118.577.645.991 1.24.991h5.754c.354 0 .692-.143.94-.396.24-.272.367-.613.335-.979-.891-10.568-7.912-15.493-22.112-15.493-12.631 0-20.166 5.334-20.166 14.275 0 9.698 7.497 12.378 19.622 13.577 14.505 1.422 15.633 3.542 15.633 6.395 0 4.955-3.978 7.066-13.309 7.066z' />
    </svg>
  )
}
function NextJSIcon ({ iconStyle }) {
  return (
    <svg className={iconStyle} viewBox='0 0 128 128'>
      <path d='M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z' />
    </svg>
  )
}
function TailwindIcon ({ iconStyle }) {
  return (
    <svg className={iconStyle} viewBox='0 0 128 128'>
      <path d='M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66-6.27-6.367-13.53-13.738-29.394-13.738zM32.004 64c-17.066 0-27.73 8.531-32 25.602C6.402 81.066 13.87 77.867 22.402 80c4.871 1.215 8.352 4.746 12.207 8.66 6.274 6.367 13.536 13.738 29.395 13.738 17.066 0 27.73-8.53 32-25.597-6.399 8.531-13.867 11.73-22.399 9.597-4.87-1.214-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64zm0 0' fill='#38b2ac' />
    </svg>
  )
}
function DartIcon ({ iconStyle }) {
  return (
    <svg className={iconStyle} viewBox='0 0 128 128'>
      <path fill='#00c4b3' d='M35.2 34.9l-8.3-8.3v59.7l.1 2.8c0 1.3.2 2.8.7 4.3l65.6 23.1 16.3-7.2-74.4-74.4z' /><path d='M27.7 93.4zm81.9 15.9l-16.3 7.2-65.4-23.1c1.3 4.8 4 10.1 7 13.2l21.3 21.2 47.6.1 5.8-18.6z' fill='#22d3c5' /><path fill='#0075c9' d='M1.7 65.1C-.4 67.3.7 72 4 75.5l14.7 14.8 9.2 3.3c-.3-1.5-.7-3-.7-4.3l-.1-2.8-.2-59.8m82.7 82.6l7.2-16.4-23-65.6c-1.5-.3-3-.6-4.3-.7l-2.9-.1-59.6.1' /><path d='M93.6 27.3c.2 0 .2 0 0 0 .2 0 .2 0 0 0zm16 82l17.7-5.8V54.8l-20.4-20.5c-3-3-8.3-5.8-13.2-7l23.1 65.6' fill='#00a8e1' /><path fill='#00c4b3' d='M90.5 18.2L75.7 3.5c-3.4-3.4-8-4.4-10.4-2.3L26.9 26.6h59.5l2.9.1c1.3 0 2.8.2 4.3.7l-3.1-9.2z' />
    </svg>
  )
}
function ReactIcon ({ iconStyle }) {
  return (
    <svg className={iconStyle} viewBox='0 0 128 128'>
      <g fill='#61DAFB'><circle cx='64' cy='64' r='11.4' /><path d='M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z' /></g>

    </svg>
  )
}
function RailsIcon ({ iconStyle }) {
  return (
    <svg className={iconStyle} viewBox='0 0 128 128'>
      <path fillRule='evenodd' clipRule='evenodd' fill='#C00' d='M109.682 14.737c-12.206-6.023-24.708-6.636-37.508-2.111-11.779 4.164-21.175 11.615-28.16 21.763C32.195 51.561 23.61 70.298 18.799 90.652c-2.464 10.417-4.06 21.466-3.631 32.224.035.873.165 1.124.251 3.124h60.366c-.173-2-.287-1.416-.437-1.797a153.86 153.86 0 01-7.428-25.198c-2.498-12.251-3.806-24.729-1.226-37.093 3.611-17.313 13.48-29.805 30.117-36.283 9.424-3.667 18.369-2.624 26.214 4.262.072.063.22.025.412.056l2.565-3.883c-4.94-4.703-10.368-8.389-16.32-11.327zM3.336 94.394c-.46 3.923-.89 7.596-1.34 11.451l11.132 1.336 2.039-11.893-11.831-.894zm21.85-34.186l-10.471-4.097-3.384 9.607 10.671 3.42c1.08-3.031 2.096-5.882 3.184-8.93zm49.419 53.659c3.575.266 7.157.449 11.103.679-1.433-2.979-2.706-5.673-4.039-8.335-.146-.289-.639-.568-.974-.573-3.033-.044-6.068-.025-9.291-.025.726 2.628 1.357 5.053 2.096 7.443.111.361.707.782 1.105.811zM42.933 31.103l-7.955-5.268-6.359 7.105 8.178 5.496 6.136-7.333zm25.334 53.369c-.013.321.276.832.558.959 2.865 1.288 5.76 2.515 8.912 3.873-.131-2.492-.219-4.575-.368-6.654-.027-.374-.203-.912-.48-1.066-2.631-1.456-5.299-2.847-8.216-4.395-.159 2.665-.321 4.972-.406 7.283zM65.91 12.3l-5.446-6.181-7.499 3.898 5.455 6.644 7.49-4.361zm3.415 49.176c-.163.374.052 1.167.373 1.456 2.175 1.962 4.424 3.84 6.926 5.981.573-2.4 1.113-4.539 1.571-6.693.081-.383-.032-1.016-.298-1.23-1.946-1.569-3.955-3.063-6.037-4.651-.915 1.815-1.802 3.443-2.535 5.137zm12.45-52.424c2.78.075 5.563.042 8.499.042-.293-2.044-.433-3.593-.782-5.092-.104-.446-.775-1.04-1.228-1.078-2.787-.226-5.585-.313-8.651-.459.409 2.063.721 3.881 1.162 5.668.093.379.647.909 1 .919zm3.385 35.675c.142-.266.178-.749.029-.981-1.366-2.137-2.785-4.241-4.254-6.455l-4.76 4.372 6.582 7.294c.884-1.539 1.675-2.868 2.403-4.23zM90.295 30.2l2.843 5.281c4.449-2.438 4.875-3.32 3.3-6.834L90.295 30.2zm21.287-16.273c1.851 1.142 3.806 2.115 5.792 3.185l1.33-2.07c-2.422-1.771-4.76-3.484-7.413-5.426-.104 1.104-.259 1.875-.219 2.637.032.581.129 1.44.51 1.674zM109 30.646c2 .217 5 .424 7 .643v-2.718c-2-.438-5-.872-7-1.323v3.398z' />
    </svg>
  )
}
function RubyIcon ({ iconStyle }) {
  return (
    <svg className={iconStyle} viewBox='0 0 128 128'>
      <path fillRule='evenodd' clipRule='evenodd' fill='#D91404' d='M35.971 111.33l81.958 11.188c-9.374-15.606-18.507-30.813-27.713-46.144L35.971 111.33zm89.71-86.383c-2.421 3.636-4.847 7.269-7.265 10.907a67619.72 67619.72 0 00-24.903 37.485c-.462.696-1.061 1.248-.41 2.321 8.016 13.237 15.969 26.513 23.942 39.777 1.258 2.095 2.53 4.182 4.157 6.192l4.834-96.58-.355-.102zM16.252 66.22c.375.355 1.311.562 1.747.347 7.689-3.779 15.427-7.474 22.948-11.564 2.453-1.333 4.339-3.723 6.452-5.661 6.997-6.417 13.983-12.847 20.966-19.278.427-.395.933-.777 1.188-1.275 2.508-4.902 4.973-9.829 7.525-14.898-3.043-1.144-5.928-2.263-8.849-3.281-.396-.138-1.02.136-1.449.375-6.761 3.777-13.649 7.353-20.195 11.472-3.275 2.061-5.943 5.098-8.843 7.743-4.674 4.266-9.342 8.542-13.948 12.882a24.011 24.011 0 00-3.288 3.854c-3.15 4.587-6.206 9.24-9.402 14.025 1.786 1.847 3.41 3.613 5.148 5.259zm28.102-6.271l-11.556 48.823 54.3-34.987-42.744-13.836zm76.631-34.846l-46.15 7.71 15.662 38.096c10.221-15.359 20.24-30.41 30.488-45.806zM44.996 56.644l41.892 13.6c-5.25-12.79-10.32-25.133-15.495-37.737L44.996 56.644zM16.831 75.643L2.169 110.691l27.925-.825-13.263-34.223zm13.593 26.096l.346-.076c3.353-13.941 6.754-27.786 10.177-42.272L18.544 71.035c3.819 9.926 7.891 20.397 11.88 30.704zm84.927-78.897c-4.459-1.181-8.918-2.366-13.379-3.539-6.412-1.686-12.829-3.351-19.237-5.052-.801-.213-1.38-.352-1.851.613-2.265 4.64-4.6 9.245-6.901 13.868-.071.143-.056.328-.111.687l41.47-6.285.009-.292zM89.482 12.288l36.343 10.054-6.005-17.11-30.285 6.715-.053.341zM33.505 114.007c-4.501-.519-9.122-.042-13.687.037-3.75.063-7.5.206-11.25.323-.386.012-.771.09-1.156.506 31.003 2.866 62.005 5.732 93.007 8.6l.063-.414-29.815-4.07c-12.384-1.691-24.747-3.551-37.162-4.982zM2.782 99.994c3.995-9.27 7.973-18.546 11.984-27.809.401-.929.37-1.56-.415-2.308-1.678-1.597-3.237-3.318-5.071-5.226-2.479 12.24-4.897 24.177-7.317 36.113l.271.127c.185-.297.411-.578.548-.897zm78.74-90.153c6.737-1.738 13.572-3.097 20.367-4.613.44-.099.87-.244 1.303-.368l-.067-.332-29.194 3.928c2.741 1.197 4.853 2.091 7.591 1.385z' />
    </svg>
  )
}
function ReactNativeIcon ({ iconStyle }) {
  return (
    <svg
      className={iconStyle}
      viewBox='-200 -200 128 128'
      xmlns='http://www.w3.org/2000/svg'
    >
      <title>React Logo</title>
      <clipPath id='prefix__a'>
        <rect
          className='prefix__screen'
          rx='3%'
          width={180}
          height={300}
          x={-90}
          y={-150}
          fill='none'
          stroke='gray'
        />
      </clipPath>
      <g transform='translate(-136.091 -135.13) scale(.38183)'>
        <rect
          x={-25}
          y={120}
          width={50}
          height={25}
          rx={2}
          fill='#fff'
          className='prefix__stand'
        />
        <rect
          className='prefix__screen prefix__background'
          rx={24.58}
          width={180}
          height={300}
          x={-90}
          y={-150}
          ry={24.511}
        />
        <rect
          className='prefix__screen'
          rx={28.465}
          width={180}
          height={300}
          x={-90}
          y={-150}
          fill='none'
          stroke='#fff'
          ry={23.761}
        />
        <g
          clipPath='url(#prefix__a)'
          className='prefix__logo'
          transform='translate(.515)'
        >
          <g
            className='prefix__logoInner'
            transform='matrix(.46167 0 0 .44952 -.793 -6.62)'
          >
            <circle r={30} fill='#61dafb' />
            <g stroke='#61dafb' strokeWidth={15} fill='none'>
              <ellipse rx={165} ry={64} />
              <ellipse rx={165} ry={64} transform='rotate(60)' />
              <ellipse rx={165} ry={64} transform='rotate(120)' />
            </g>
          </g>
          <path
            stroke='#fff'
            strokeWidth={8}
            strokeLinecap='round'
            className='prefix__speaker'
            d='M-30 130h60'
          />
        </g>
      </g>
    </svg>
  )
}

function VercelIcon ({ iconStyle }) {
  return (
    <svg
      className={iconStyle}
      viewBox='0 0 128 128'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <clipPath clipPathUnits='userSpaceOnUse' id='prefix__a'>
          <path
            style={{
              afillRule: 'nonzero'
            }}
            d='M0 0v64h161.328c-.948-3.199-1.097-6.853-1.29-9.406l-.204-2.69c-.986 1.14-1.894 2.356-3.049 3.317-1.503 1.25-5.059 2.275-6.789 2.869-2.021.453-4.019 1.033-6.064 1.36-1.007.16-2.04.125-3.059.097a61.22 61.22 0 01-5.027-.32c-.68-.075-1.336-.287-1.998-.456-3.277-.834-2.411-.573-5.002-1.585-1.033-.573-2.096-1.096-3.1-1.72-.446-.276-.84-.631-1.238-.974-1.732-1.492-1.564-1.331-2.637-2.521-.286-.317-.61-.603-.855-.953a32.757 32.757 0 01-.99-1.524c-.493.77-1.092 1.303-1.89 1.135-2.032-.43-.906-6.412-2.804-5.566-5.491 2.445-8.198 8.863-12.928 12.572-1.154.905-2.443-3.856-3.375-2.824-.278-.33-.561-.656-.843-.983-.995-.513-1.543-1.216-1.727-2.062-.086-.108-.178-.21-.262-.319-.266-.342-.438-.748-.65-1.127-.83-1.48-1.437-2.75-2.352-4.197-.64-1.013-1.319-2.001-1.978-3.002-.868-1.463-1.778-2.901-2.606-4.387-3.881-.284-7.75-.723-11.627-1.072-.122-.01-.246 0-.369 0-18.276 0-18.276-18.463 0-18.463.123 0 .247-.01.37 0 1.157.09 2.313.199 3.47.297-.919-.717-1.788-1.476-2.4-2.451-1.657-2.64 1.935-2.461.037-2.461-12.884 0-16.673-9.17-11.39-14.584zm85.967 0a98.344 98.344 0 004.162 3.078c1.972 1.385 3.615 3.192 5.348 4.867.152.148 5.277 5.176 5.87 6.655.266.661.472 1.342.66 2.029 2.646-3.769 2.162-3.283 4.554-5.307 1.492-1.262 2.96-2.227 4.376-2.931.426-1.443 1.241-2.955 1.956-4.323.95-1.763 1.325-2.73 2.757-4.068zm45.582 0c1.05 1.207 2.07 2.444 3.097 3.676a10.095 10.095 0 011.985 2.303c.551.64 1.089 1.295 1.658 1.917 3.548 3.88 2.59 3.578-.088 1.627a19.15 19.15 0 01.67 3.403 8.698 8.698 0 013.443-.754c3.77-.055 6.164.78 8.729 2.824 2.758 2.198 2.317 1.725 3.539 3.215.31.873-.087-.152 1.574 1.594a37.581 37.581 0 011.883 2.162 59.476 59.476 0 013.506 4.724h.033c.267-1.093.351-1.429.55-2.236-1.777-1.397-3.1-3.736-4.134-5.197l2.621-10.961c1.556-6.507 3.083-3.945 4.576 1.004.4-.12.823-.233 1.248-.352 1.92-.847 3.828-1.691 5.793-1.293 4.406.893 6.115 2.994 7.18 5.631 6.142-2.622 7.702-3.134 10.565 6.883.167-.354.348-.7.558-1.03.762-1.188 1.5-2.478 2.639-3.314 6.317-4.641 4.61-.741 5.449-2.68 2.191-.73 1.093-.405 5.951-.82 2.494-.213 4.665-.066 7.172.272.87.117 1.737.29 2.58.537 1.144.336 2.245.806 3.367 1.209 2.784 1.28 5.594 2.502 8.371 3.795.915.425 1.825.862 2.73 1.304 1.438.702.834.714 1.491.672-1.566-.58.585.132 1.47.428.13-.153.257-.309.417-.428 1.73-1.287 3.513-2.513 5.375-3.6 1.903-1.11 4.848-2.034 6.967-2.474 2.25-.467 4.227-.309 6.533-.295 3.338.088 2.943-.002 6.836.566.853.125 1.743.158 2.54.485 1.776.727 3.582 1.488 5.11 2.648 1.095.832 1.806 1.575 2.334 2.338.05-1.229.103-2.459.16-3.687.162-3.438.372-6.874.504-10.313.085-2.208.435-4.13.973-5.783zm34.89 8.95c-.398.175-.795.35-1.195.515.653 2.19 1.298 4.798 1.938 7.328.897-1.119 1.757-2.246 2.42-3.42 1.106-.096 1.551-.14 2.216-.049.249-.015.497-.039.746-.04a61.04 61.04 0 011.944.013l.332-1.592c-.76-.933-2.509-3.927-4.444-3.684-.928.117-2.458.51-3.957.928zm-1.195.515c-.018-.06-.035-.106-.053-.164-2.115.632-3.68 1.198-2.3.924.793-.158 1.575-.439 2.353-.76zm6.703 4.637c-.71.379-1.3 1.074-1.804 1.943 1.139-.495 2.297-.94 3.472-1.328-.574-.194-1.129-.4-1.668-.615zm1.932 2.212c-.28.155-.641.694-.463.547.142-.116.28-.234.422-.351l.04-.196zm-71.184 1.266a1.31 1.31 0 00-.416.084c.174.716.348 1.431.518 2.148.206-.646.483-1.31.812-1.982-.121-.047-.231-.115-.355-.158a1.534 1.534 0 00-.559-.092zm131.967 1.902c-.408.126-1.481.73-2.406 1.227l.014.004c.235.081.449.172.675.258.637-.35 1.249-.729 1.737-1.26.217-.236.178-.29-.02-.229zm33.645.413c-.018-.023-.065.189-.114.418.03.05.063.102.092.154.008-.13.028-.26.031-.39.003-.113 0-.17-.01-.182zm-105.758.17c-1.808.67-4.25 1.536-.2 3.5.11-.44.395-1.61.407-1.65.03-.106.048-.23.072-.343-.098-.502-.202-1.003-.28-1.508zm25.027 5.833c.071.1.144.198.215.297.009-.042.016-.085.023-.127l-.238-.17zm19.502 1.436c.05-.099-.178.141-.232.238-.307.545-.446.896-.543 1.227.365-.397.527-.976.775-1.465zm60.594.314c-.007.004-.016.012-.024.016l.024.01zm-127.697 1.883l.035.02c-.007-.006-.011-.014-.018-.02-.005-.004-.012.003-.017 0zm68.19 1.162c-.709-.036-1.418.055-2.126.05-.023.276-.023.357-.07.743-.19 1.322-.333 2.652-.567 3.967-.013.076-.1.203-.166.162-.226-.141-.33-.423-.53-.597-.056-.048-.15-.015-.214-.05-.537-.286-1.998-1.355-1.584-.91.618.665 1.474 1.058 2.211 1.587l2.34 2.382c.156-.018.312-.041.469-.056 1.177-.067 4.302-.3 6.412-.274.646-1.624 1.17-2.964 1.57-3.886-1.633-.73-3.267-1.456-4.87-2.247-1.163-.56-1.442-.798-2.876-.87zm-20.866 1.082c-2.223 2.244-4.307 4.175-6.436 5.844-.075 1.103-.148 2.207-.238 3.309-.135 1.66-.4 3.308-.55 4.967-.65 7.111-.545 5.105-.387 11.207a13.099 13.099 0 00-.59 1.793c.214.513.483 1.053.152.912-.119-.05-.208-.097-.324-.147-.319 1.412-.55 2.917-.858 4.34h104.653v-5.334c-.78.311-1.551.652-2.373.799-1.734.31-3.509.317-5.266.435-1.197.08-2.398.224-3.596.16-2.527-.133-5.044-.426-7.554-.748-1.818-.233-7.856-1.412-9.698-1.763a138.099 138.099 0 00-9.146-1.604c-.913-.127-1.828-.232-2.744-.336-.444-.05-.886-.112-1.332-.123-.226-.005-.45.051-.674.076-.806 1.035-.31.425-3.799-.218-.933-.172-2.1-.18-2.693-.922-1.46-1.826-2.578-3.28-3.477-4.623-.923 2.224-1.923 2.347-5.23 5.699-4.378 1.25-4.22 1.816-8.559.875-.898-.195-1.652-.917-2.566-1.008-.35-.035.98.666.664.819-.703.338-1.562-.04-2.342-.01-1.094.041-2.183.148-3.275.222-2.723.278-3.46.491-6.702-.158-1.225-.245-2.481-.565-3.54-1.228-1.581-.99-2.938-2.316-4.245-3.647-1.703-1.733-1.608-3.372-1.61-1.822-2.29-1.13-1.513-.669-4.448-5.32a9.778 9.778 0 01-1.317-3.34c-.358-1.861-.436-3.775-.42-5.67.01-1.1.34-2.175.496-3.264l.024-.172zm17.746 6.198c-.092-.003-.096.277-.004.277.387 0 .773-.042 1.158-.084a4.835 4.835 0 00-1.154-.193zm14.984.361a5.562 5.562 0 00-.787.02c1.02.196 2.042.39 3.072.521.52.066-.98-.407-1.501-.47-.29-.036-.548-.06-.784-.071zm-106.95 4.207c-.02.025-.037.053-.056.078.054.045.104.092.159.135.096.076.024-.056-.104-.213zm100.138.527c-.05.071-.105.14-.155.211-.038.055-.004.261.022.2.056-.134.085-.275.133-.41zm26.443.926l-.246.084.072-.008.198-.072-.024-.004zm-11.719 1.27a5.587 5.587 0 00-.738.037c-.281.034.514.238.772.357.096.007.18-.016.27-.023-.04-.118-.075-.241-.112-.362-.064-.002-.128-.009-.192-.01z'
            fill='red'
          />
        </clipPath>
      </defs>
      <path
        d='M36.95 0L73.9 64C49.267 64-168.859 283.64 0 64z'
        fill='#000'
        clipPath='url(#prefix__a)'
        transform='matrix(1.73443 0 0 1.73443 .02 8.554)'
      />
    </svg>
  )
}

function VercelInvertIcon ({ iconStyle }) {
  return (
    <svg
      className={`${iconStyle} rounded-sm`}
      viewBox='0 0 128 128'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path fill='#000000' fillRule='evenodd' d='M0 0h128.597v128.267H0z' />
      <path d='M15.74 104.349h97.246L64.344 24.106z' fill='#ffffff' />
    </svg>
  )
}

import { useEffect, useRef, useState } from "react";

const FadeIn = ({ children, delay = 0 }) => {

const ref = useRef();
const [visible,setVisible]=useState(false);

useEffect(()=>{

const observer=new IntersectionObserver(([entry])=>{
if(entry.isIntersecting){
setTimeout(()=>setVisible(true),delay);
}
});

observer.observe(ref.current);

},[]);

return(

<div
ref={ref}
className={`transition-all duration-700 ${
visible
? "opacity-100 translate-y-0"
: "opacity-0 translate-y-10"
}`}
>
{children}
</div>

);

};

export default FadeIn;
// import { useEffect, useRef, useState } from "react";

// const FadeIn = ({ children, delay = 0 }) => {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//         }
//       },
//       { threshold: 0.2 }
//     );

//     if (ref.current) observer.observe(ref.current);

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div
//       ref={ref}
//       style={{ transitionDelay: `${delay}ms` }}
//       className={`transition-all duration-700 ease-out transform ${
//         visible
//           ? "opacity-100 translate-y-0"
//           : "opacity-0 translate-y-10"
//       }`}
//     >
//       {children}
//     </div>
//   );
// };

// export default FadeIn;
import { useState, useEffect } from "react";

const images = [

"https://images.unsplash.com/photo-1535930749574-1399327ce78f", // cow livestock
"https://images.unsplash.com/photo-1546182990-dffeafbe841d", // lion wildlife
"https://images.unsplash.com/photo-1518717758536-85ae29035b6d", // dog pet
"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba", // cat pet
"https://images.unsplash.com/photo-1516467508483-a7212febe31a", // sheep livestock
"https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308", // rabbit
"https://images.unsplash.com/photo-1524704654690-b56c05c78a00", // fish aquatic
"https://images.unsplash.com/photo-1474511014068-2c7b2b1b4a03", // eagle wildlife
"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
"https://images.unsplash.com/photo-1560807707-8cc77767d783",
"https://images.unsplash.com/photo-1501706362039-c6e80948bb3a",
"https://images.unsplash.com/photo-1508672019048-805c876b67e2",
"https://images.unsplash.com/photo-1546182990-dffeafbe841d",
"https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
"https://images.unsplash.com/photo-1557053910-d9eadeed1c58",
"https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0",
"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e", // dog
"https://images.unsplash.com/photo-1558788353-f76d92427f16", // puppy
"https://images.unsplash.com/photo-1560807707-8cc77767d783", // cat
"https://images.unsplash.com/photo-1574158622682-e40e69881006", // cat
"https://images.unsplash.com/photo-1601758228041-f3b2795255f1",
"https://images.unsplash.com/photo-1518717758536-85ae29035b6d",
"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
"https://images.unsplash.com/photo-1535591273668-578e31182c4f",
"https://images.unsplash.com/photo-1552410260-0fd9b577afa6",
"https://images.unsplash.com/photo-1535941339077-2dd1c7963098",
"https://images.unsplash.com/photo-1589656966895-2f33e7653819",
"https://images.unsplash.com/photo-1592194996308-7b43878e84a6",
"https://images.unsplash.com/photo-1552728089-57bdde30beb3",
"https://images.unsplash.com/photo-1522926193341-e9ffd686c60f",
"https://images.unsplash.com/photo-1517849845537-4d257902454a",
"https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8", // goat
"https://images.unsplash.com/photo-1516467508483-a7212febe31a", // sheep
"https://images.unsplash.com/photo-1474511014068-2c7b2b1b4a03", // eagle
"https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0", // snake
"https://images.unsplash.com/photo-1598755257130-c2aaca1f061c", // lizard
"https://images.unsplash.com/photo-1546182990-dffeafbe841d", // lion
"https://images.unsplash.com/photo-1524704654690-b56c05c78a00", // fish
"https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308", // rabbit
"https://images.unsplash.com/photo-1497206365907-f5e630693df0", // parrot

];

const AnimalCarousel = () => {

const [index,setIndex] = useState(0);

useEffect(()=>{

const interval = setInterval(()=>{
setIndex((prev)=>(prev+1)%images.length);
},5000);

return ()=>clearInterval(interval);

},[]);

return(

<div className="absolute inset-0">

{images.map((img,i)=>(

<img
key={i}
src={img}
className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms]
${i===index?"opacity-100":"opacity-0"}`}
/>

))}

{/* light overlay so text is visible */}

<div className="absolute inset-0 bg-white/60"></div>

</div>

)

}

export default AnimalCarousel;

export const NavLinks = [
  { name: "Home", href: "/" },
  { name: "Doctors", href: "/doctors" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];


import appointment_img from '../public/images/appointment_img.png'
import header_img from '../public/images/header_img.png'
import group_profiles from '../public/images/group_profiles.png'
import profile_pic from '../public/images/profile_pic.png'
import contact_image from '../public/images/contact_image.png'
import about_image from '../public/images/about_image.png'
import logo from '../public/images/logo.svg'
import dropdown_icon from '../public/images/dropdown_icon.svg'
import menu_icon from '../public/images/menu_icon.svg'
import cross_icon from '../public/images/cross_icon.png'
import chats_icon from '../public/images/chats_icon.svg'
import verified_icon from '../public/images/verified_icon.svg'
import arrow_icon from '../public/images/arrow_icon.svg'
import info_icon from '../public/images/info_icon.svg'
import upload_icon from '../public/images/upload_icon.png'
import stripe_logo from '../public/images/stripe_logo.png'
import razorpay_logo from '../public/images/razorpay_logo.png'

import doc1 from '../public/images/doc1.png'
import doc2 from '../public/images/doc2.png'
import doc3 from '../public/images/doc3.png'
import doc4 from '../public/images/doc4.png'
import doc5 from '../public/images/doc5.png'
import doc6 from '../public/images/doc6.png'
import doc7 from '../public/images/doc7.png'
import doc8 from '../public/images/doc8.png'
import doc9 from '../public/images/doc9.png'
import doc10 from '../public/images/doc10.png'
import doc11 from '../public/images/doc11.png'
import doc12 from '../public/images/doc12.png'
import doc13 from '../public/images/doc13.png'
import doc14 from '../public/images/doc14.png'
import doc15 from '../public/images/doc15.png'


import General_physician from '../public/images/General_physician.svg'
import Gynecologist from '../public/images/Gynecologist.svg'
import Dermatologist from '../public/images/Dermatologist.svg'
import Pediatricians from '../public/images/Pediatricians.svg'
import Neurologist from '../public/images/Neurologist.svg'
import Gastroenterologist from '../public/images/Gastroenterologist.svg'







export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}


export const services = [
  {
    title: "Comprehensive Care",
    desc: "Full dental care for all ages with preventive and advanced treatments.",
  },
  {
    title: "Advanced Technology",
    desc: "We use modern equipment for accurate diagnosis and safe procedures.",
  },
  {
    title: "Online Consultation",
    desc: "Get expert advice from home with our easy online consultation.",
  },
  {
    title: "24/7 Emergency Support",
    desc: "Immediate help for urgent dental issues anytime.",
  },
  {
    title: "Free Consultation Call",
    desc: "Talk to our experts and get guidance before booking.",
  },
];

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        consultationType: 'BOTH',
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Larson specializes in women\'s health with extensive experience in obstetrics and gynecology.',
        fees: 60,
        consultationType: 'ONLINE',
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Patel focuses on skin health, treating conditions ranging from acne to complex dermatological disorders.',
        fees: 30,
        consultationType: 'BOTH',
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Lee provides compassionate care for children from newborns to adolescents.',
        fees: 40,
        consultationType: 'PHYSICAL',
        address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Garcia specializes in disorders of the nervous system including the brain, spinal cord, and nerves.',
        fees: 50,
        consultationType: 'BOTH',
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Williams has expertise in treating migraines, epilepsy, and neurodegenerative conditions.',
        fees: 50,
        consultationType: 'ONLINE',
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis is dedicated to primary care and preventive health management.',
        fees: 50,
        consultationType: 'PHYSICAL',
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. White provides comprehensive gynecological care with a patient-centered approach.',
        fees: 60,
        consultationType: 'BOTH',
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Mitchell specializes in cosmetic and medical dermatology.',
        fees: 30,
        consultationType: 'ONLINE',
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. King is committed to the health and well-being of infants, children, and teenagers.',
        fees: 40,
        consultationType: 'BOTH',
        address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Kelly focuses on neuromuscular diseases and movement disorders.',
        fees: 50,
        consultationType: 'PHYSICAL',
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Harris specializes in stroke management and cognitive neurology.',
        fees: 50,
        consultationType: 'BOTH',
        address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Evans provides holistic primary care for patients of all ages.',
        fees: 50,
        consultationType: 'ONLINE',
        address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Martinez specializes in reproductive health and minimally invasive gynecological procedures.',
        fees: 60,
        consultationType: 'PHYSICAL',
        address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Hill treats a wide spectrum of skin, hair, and nail conditions.',
        fees: 30,
        consultationType: 'BOTH',
        address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' }
    },
]
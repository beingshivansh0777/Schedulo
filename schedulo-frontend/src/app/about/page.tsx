"use client"
import React from 'react'
import Image from 'next/image';
import { describe } from 'node:test';
import { Description } from '@radix-ui/react-dialog';
import { Radius } from 'lucide-react';

const features = [
  {
    title:'• User-Friendly Interface: ',
    description:' Simplified and sleek UI for seamless event creation and management.'
  },
  {
    title:'• Customizable Events: ',
    description:'Configure events for multiple time slots and preferences.'
  },
  {
    title:'• Automated Emails: ',
    description:'Send confirmation emails to approved participants.'
  },{
    title:'• Real-Time Insights: ',
    description:'Access dashboards to track registrations, approvals, and participant counts.'
  },
  {
    title:'• Open Source: ',
    description:' Fully customizable and open to contributions from the community.'
  }
]
const cardsData = [
  {
    icon: '📅', // Use emoji or component for icons
    title: 'Seamless Event Creation',
    description: 'Create and manage events with ease.'
  },
  {
    icon: '⏱️', 
    title: 'Convenient Time Slot Selection',
    description: 'Allow participants to select time slots as per their convenience.'
  },
  {
    icon: '🔗',
    title: 'Effortless Registration Sharing',
    description: 'Share registration links with anyone, anywhere.'
  }
];

function Page() {
  return (
    <>
      <div className='w-full'>
        <div className='w-full flex items-center h-12 shadow-md'>
          <div className='w-11/12 flex justify-center items-center flex-row'>
          <div className='flex items-center justify-start'>
            <div className='rounded-xl pt-2' style={{ position: "relative", width: "25px", height: "25px", }} >
              <Image src="/favicon.ico"
                alt='img'
                fill
                style={{ objectFit: "fill" }}
              />
            </div>
            <div>
              <h1 className='text-2xl font-extrabold'>Schedulo</h1>
            </div>
            </div>
          </div>
        </div>
        {/* image section */}
        <div className='rounded-xl z-1' style={{ display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center", width: "100%", height: "35rem" }}>
          <div className='rounded-xl' style={{ position: "relative", width: "90%", height: "30rem", }} >
            <Image src="/images/bg8.jpg"
              alt='img'
              fill
              style={{ objectFit: "fill"}}
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="pl-1 m-3" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", alignContent: "center", width: "100%", height: "23%" }}>
          <h1 className='text-black font-extrabold pl-9 text-5xl mb-1 '>📍Overview</h1>
          <div className='pl-9 m-3 h-35'>
            <h1 className='text-gray-600  text-xl leading-relaxed'>
              Schedulo is a modern event scheduling platform designed to streamline the creation and management of events, interviews, and meetings. With Schedulo, users can:
            </h1>
            <h1 className='text-gray-600  text-xl leading-relaxed'>
              <ul className='list-disc m-3 ml-8'>
                <li>
                  Create events (online or offline) with ease.
                </li>
                <li>
                  Generate and share unique registration links for participants.
                </li>
                <li>
                  Allow participants to register and select time slots based on their preferences.
                </li>
                <li>
                  Approve or reject registrations and send confirmation emails automatically.
                </li>
                <li>
                  Access insightful analytics, including participant statistics and event summaries, via an intuitive dashboard.
                </li>
              </ul>
            </h1>
          </div>
        </div>
        <h2 className='text-black font-extrabold ml-2 pl-9 text-5xl mb-1 '>📋 Why Choose Schedulo?</h2 >
        <div className='pl-9 ml-3 pt-2'>
          {features.map((f, index) => (
            <div key={index} className=" flex justify-start shadow-sm m-2">
              <div className='flex items-start   w-full direction-normal p-1 m-1 max-md:flex-col'>
                  <h3 className="text-xl font-semibold  text-gray-800">{f.title}</h3>
                <p className='w-1'></p> {/* Title */}
                <p className="text-gray-600 leading-relaxed text-lg ">{f.description}</p> {/* Description */}
              </div>
            </div>

          ))}
        </div>
        <div className=' pl-9'>
          <div className="flex justify-around gap-5 p-5 max-md:flex-col"> {/* Container */}
            {cardsData.map((card, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md transition transform duration-200 ease-in-out hover:translate-y-[-5px] hover:shadow-lg flex-1"> {/* Card */}
                <div className="text-3xl mb-3 text-gray-600">{card.icon}</div> {/* Icon */}
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{card.title}</h3> {/* Title */}
                <p className="text-gray-600 leading-relaxed">{card.description}</p> {/* Description */}
              </div>

            ))}
          </div>
        </div>

        {/* footer */}
        <footer className="text-center text-base text-gray-600 py-4 flex-shrink-0">
          <p>
            © 2025 Schedulo.{" "}
            <a
              href="https://github.com/mukundsolanki/Schedulo/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              MIT Licensed
            </a>
            . Contribute on{" "}
            <a
              href="https://github.com/mukundsolanki/Schedulo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Github
            </a>
            .
          </p>
        </footer>
      </div>
    </>

  )
}

export default Page
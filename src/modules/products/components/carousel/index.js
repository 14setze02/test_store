import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Container } from "@medusajs/ui"
import Image from "next/image"
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

export default function Swips(props) {
  return (
    <>
      <Swiper
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay,Pagination, Navigation]}
        className="mySwiper"
      >
          {
            props?.images?.map((image, index) => {
              return (
                <SwiperSlide key={index} >
                  <Container
                    key={image.id}
                    className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
                    id={image.id}
                  >
                    <Image
                      src={image.url}
                      priority={index <= 2 ? true : false}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </Container>
                </SwiperSlide>
              )
            })}
      </Swiper>
    </>
  );
}

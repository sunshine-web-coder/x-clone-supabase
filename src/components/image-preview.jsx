import { X } from "lucide-react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function ImagePreview({ images, onRemove }) {
  if (images.length === 0) return null

  return (
    <div className="mt-4 mb-3 relative w-full">
      <div className="aspect-[16/9] w-full">
        {" "}
        {/* Fixed aspect ratio container */}
        <Swiper
          slidesPerView={images.length === 1 ? 1 : 2}
          spaceBetween={10}
          navigation={images.length > 1}
          pagination={images.length > 1 ? { clickable: true } : false}
          modules={[Navigation, Pagination]}
          className="mySwiper !absolute inset-0 h-full w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id} className="h-full">
              <div className={`relative h-full w-full ${images.length === 1 ? "rounded-xl overflow-hidden" : ""}`}>
                <Image
                  src={URL.createObjectURL(image.file) || "/placeholder.svg"}
                  alt={`Selected image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className={images.length > 1 ? "rounded-xl" : ""}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onRemove(image.id)
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-75 text-white rounded-full p-1 transition-opacity hover:bg-opacity-100 z-10"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X size={16} />
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
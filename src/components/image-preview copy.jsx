import { X } from "lucide-react"
import Image from "next/image"

export function ImagePreview({ images, onRemove }) {
  if (images.length === 0) return null

  const getGridClassName = () => {
    switch (images.length) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-2"
      case 4:
        return "grid-cols-2"
      default:
        return "grid-cols-2"
    }
  }

  const getImageClassName = (index, totalImages) => {
    if (totalImages === 1) {
      return "rounded-2xl object-cover w-full h-full max-h-[500px]"
    }
    if (totalImages === 2) {
      return "rounded-2xl object-cover w-full h-full max-h-[280px]"
    }
    // if (totalImages === 3) {
    //   return index === 0
    //     ? "rounded-2xl object-cover w-full h-full max-h-[400px]"
    //     : "rounded-2xl object-cover w-full h-full max-h-[198px]"
    // }
    return "rounded-2xl object-cover w-full h-full max-h-[198px]"
  }

  return (
    <div className={`mt-4 mb-3 grid ${getGridClassName()} gap-2 max-h-[500px]`}>
      {images.map((image, index) => (
        <div key={image.id} className={`relative group`}>
          <Image
            src={URL.createObjectURL(image.file) || "/placeholder.svg"}
            alt={`Selected image ${index + 1}`}
            width={500}
            height={500}
            className={getImageClassName(index, images.length)}
          />
          <button
            onClick={() => onRemove(image.id)}
            className="absolute top-2 right-2 bg-black bg-opacity-75 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={`Remove image ${index + 1}`}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}


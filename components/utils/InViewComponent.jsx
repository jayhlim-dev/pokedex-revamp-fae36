import { useState, useEffect, useRef } from 'react'

export default function InViewComponent({ children, className }) {
  const [inView, setInView] = useState(false)
  const [alreadyInView, setAlreadyInView] = useState(false) // New state variable
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!alreadyInView && entry.isIntersecting) {
          setInView(true)
          setAlreadyInView(true) // Once inView becomes true, set alreadyInView to true
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0, // Adjust threshold as per your requirement
      },
    )

    const element = ref.current

    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [alreadyInView])

  return (
    <div ref={ref} className={className+' '+ inView || ''}>
      {inView && children}
    </div>
  )
}

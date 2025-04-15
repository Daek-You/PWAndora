import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ISlideNumberProps {
  value: number
}

export default function SlideNumber({ value }: ISlideNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [prevValue, setPrevValue] = useState<number | null>(null)

  useEffect(() => {
    if (value !== displayValue) {
      setPrevValue(displayValue)
      setDisplayValue(value)
    }
  }, [value])

  return (
    <div className='text-4xl font-bold w-full overflow-hidden h-12 relative'>
      <AnimatePresence mode='sync'>
        {prevValue !== null && (
          <motion.div
            key={`prev-${prevValue}`}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -40, opacity: 0 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='absolute top-0 left-0'
          >
            {prevValue.toLocaleString()}
          </motion.div>
        )}
        <motion.div
          key={`curr-${displayValue}`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className='absolute top-0 left-0'
        >
          {displayValue.toLocaleString()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

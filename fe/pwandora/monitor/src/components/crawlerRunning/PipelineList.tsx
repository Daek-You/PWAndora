import { AnimatePresence, motion } from 'framer-motion'
import { useSiteProcess } from '../../apis/crawler'
import PipelineListItem from './PipelineListItem'

export default function PipelineList() {
  const { data } = useSiteProcess()

  return (
    <div>
      <AnimatePresence>
        {data.map(site => (
          <motion.div
            key={`${site.id}`}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              height: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <PipelineListItem {...site} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FileText } from 'lucide-react'

const AccordionSections = ({ sections }: AccordionSectionsProps) => {
    return (
        <Accordion type='multiple' className='w-full'>
            {sections?.map((section, index) => (
                <AccordionItem
                    key={section.sectionId}
                    value={section.sectionTitle}
                    className='border-x border-b border-gray-600 overflow-hidden first:border-t first:rounded-t-lg last:rounded-b-lg' >
                    <AccordionTrigger className=' px-4 py-3'>
                        <h5 className='dark:text-gray-300 text-gray-900 font-medium'>{section.sectionTitle}</h5>
                    </AccordionTrigger>
                    <AccordionContent className='px-4 py-3'>
                        <ul>
                            {section.chapters.map((chapter, index) => (
                                <li key={chapter.chapterId} className=' flex items-center dark:text-gray-300 text-gray-900 py-1'>
                                    <FileText className='mr-2 w-4 h-4' />
                                    <span className='text-sm'>{chapter.title}</span>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

export default AccordionSections

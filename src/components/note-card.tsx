import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import {ptBR} from 'date-fns/locale'
import { X } from 'lucide-react'

interface NoteCardProps {
    note: {
        id: string
        date: Date
        content: string
    }

    onNoteDeleted: (id: string) => void
}

export function NoteCard({note, onNoteDeleted }: NoteCardProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-sm text-left flex flex-col outline-none bg-slate-100 p-5 space-y-3 overflow-hidden relative hover:bg-white focus-visible:ring-2 focus-visible:ring-slate-950'>
                <span className='text-sm font-medium leading-6 text-slate-800'>
                    {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
                </span>
                <p className='text-sm leading-6 text-slate-600'>
                {note.content}
                </p>
                <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-300/70 to-slate-300/0 pointer-events-none' />
            </Dialog.Trigger>

            <Dialog.Portal>

                <Dialog.Overlay className='inset-0 fixed bg-black/50'/>

                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-100 md:rounded-sm flex flex-col outline-none">
                   
                    <Dialog.DialogClose className='absolute right-0 top-0 hover:text-slate-900 p-2 text-slate-600'>
                        <X className='size-5'/>
                    </Dialog.DialogClose>

                    <div className='flex flex-1 flex-col gap-3 p-5'>
                        <span className='text-sm font-semibold leading-6 text-slate-800'>
                        {formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true})}
                        </span>

                        <p className='text-2xl font-medium leading-8 text-slate-700'>
                        {note.content}
                        </p>
                    </div>

                    <button 
                        type='button'
                        onClick={() => onNoteDeleted(note.id)}
                        className='w-full bg-slate-300 hover:bg-slate-200 py-4 text-center text-sm text-slate-700 outline-none font-medium group'
                        >
                            Deseja <span className='text-red-600 group-hover:underline'>apagar esta nota</span>?
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
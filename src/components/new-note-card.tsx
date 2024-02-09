import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const speechRecognition = new SpeechRecognitionAPI();

export function NewNoteCard ({ onNoteCreated }:NewNoteCardProps) {

    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [content, setContent] = useState('')

    function handleStartEditor() {
      setShouldShowOnboarding(false)
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
      setContent(event.target.value)

      if (event.target.value === '') {
        setShouldShowOnboarding(true)
      }
    }

    function handleSaveNote(event: FormEvent) {
      event.preventDefault()

      if (content === '') {
        return
      }

      onNoteCreated(content) 

      setContent('')
      setShouldShowOnboarding(true)

      toast.success('Nota criada com sucesso.')
    }


    function handleStartRecording() {

      const isSpeechRecognitionAPIAvailable = 
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window

      if (!isSpeechRecognitionAPIAvailable) {
        alert('Infelizmente seu navegador não suporta API de gravação!')
        return
      }

      setIsRecording(true)
      setShouldShowOnboarding(false)

      speechRecognition.lang = "pt-BR"
      speechRecognition.continuous = true
      speechRecognition.maxAlternatives = 1
      speechRecognition.interimResults = true

      speechRecognition.onresult = (event) => {
        const transcription = Array.from(event.results).reduce((text,result) => {
          return text.concat(result[0].transcript)
        }, '')

        setContent(transcription)
      }

      speechRecognition.onerror = (event) => {
        console.error(event)
      }

      speechRecognition.start()

    }

    function handleStopRecording() {
      setIsRecording(false)

      if (speechRecognition !== null) {
        speechRecognition.stop();
    }
  }

    return (
      <Dialog.Root>

        <Dialog.Trigger className='flex flex-col rounded-sm bg-lime-300 p-5 gap-3 text-left outline-none hover:ring-2 hover:ring-lime-100 focus-visible:ring-2 focus-visible:ring-lime-900'>

          <span className='text-xl font-semibold leading-6 text-slate-800'>
            Adicionar notas
          </span>

          <p className='flex flex-grow text-sm leading-6 text-slate-700'>
            Grave uma nota em áudio que será convertida para texto automaticamente.
          </p>

            <div className='left-0 top-0 bg-slate-100 hover:bg-slate-200 text-slate-600 p-2'>
                <ArrowUpRight className='size-5'/>
            </div>

        </Dialog.Trigger>

        <Dialog.Portal>

          <Dialog.Overlay className='inset-0 fixed bg-black/50'/>

            <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-100 md:rounded-sm flex flex-col outline-none">
            <Dialog.DialogClose className='absolute right-0 top-0 hover:text-slate-900 p-2 text-slate-600'>
                <X className='size-5'/>
                  </Dialog.DialogClose>

                  <form onSubmit={handleSaveNote} className='flex-1 flex flex-col'>
                    <div className='flex flex-1 flex-col gap-3 p-5'>
                      <span className='text-sm font-semibold leading-6 text-slate-800'>
                        Adicionar nota
                      </span>
                      
                          {shouldShowOnboarding ? (
                            <p className='text-2xl font-medium leading-8 max-w-[65%] py-6 text-slate-700'>
                            <button type='button' onClick={handleStartRecording} className='font-semibold hover:underline text-violet-600'>gravar uma nota em áudio 🎤</button> ou se preferir <button type='button' onClick={handleStartEditor} className='font-semibold hover:underline text-violet-600'>utilize apenas texto 🎹</button>
                            </p>
                          ) : (
                          <textarea 
                          autoFocus 
                          className='text-sm leading-6 text-slate-700 bg-transparent resize flex-1 outline-none' 
                          onChange={handleContentChanged}
                          value={content}
                          />
                          ) }
                      </div>

                      {isRecording ? (
                        <button 
                          type='button'
                          onClick={handleStopRecording}
                          className='w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-700 py-4 text-center text-sm text-slate-300 outline-none font-semibold group'>
                            <div className='size-2 rounded-full bg-red-500 animate-pulse' />
                            Gravando! (Clique p/ interromper)
                        </button>
                      ) : (
                        <button 
                            type='button'
                            onClick={handleSaveNote}
                            className='w-full bg-lime-400 hover:bg-lime-500 py-4 text-center text-sm text-slate-900 outline-none font-semibold group'>
                              <span>Salvar nota</span>
                        </button>
                      )}

                  </form>
                  
            </Dialog.Content>

         </Dialog.Portal>

      </Dialog.Root>
    )
  }
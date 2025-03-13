import './style.css'

document.querySelector('#app').innerHTML = `
        <header class="flex flex-col">
          <div class="bg-[#75aadb] dark:bg-[#2c4c6e]  p-5 items-center flex justify-around  sm:justify-between">
              <div class="flex">
                  <div class="relative flex items-center">
                      <span class="absolute bg-amber-300 dark:bg-amber-400 p-1 rounded-full right-0 top-0 "></span>
                      <img src="code.png" class="h-5 md:h-8" alt="code tag"/>
                  </div>
                  <h2 class="text-white font-bold text-base md:text-2xl">MILANGLANG</h2>
              </div>
              <div class="flex gap-2 items-center">
                <button class="bg-blue-400 hover:cursor-pointer hover:bg-blue-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-all ease-in-out duration-300 p-3 rounded-full relative w-12 h-12 flex items-center justify-center" id="darkMode">
                  <span class="relative w-6 h-6">
                    <svg class="absolute inset-0 w-[24px] h-[24px] text-yellow-400 transition-all duration-200 ease-in-out dark:opacity-0 dark:scale-0" id="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g fill="currentColor">
                        <circle r="5" cy="12" cx="12"></circle>
                        <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
                      </g>
                    </svg>
                    <svg class="absolute inset-0 w-[24px] h-[24px] text-white transition-all duration-500 ease-in-out -rotate-90 opacity-0 scale-0 dark:opacity-100 dark:scale-100" id="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                      <path fill="currentColor" d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
                    </svg>
                  </span>
                </button>
                <a href="https://github.com/CandelaMenaBisignano07" target="_blank"><svg class="w-12 h-12 hover:scale-90 hover:cursor-pointer hover:ease-in-out hover:duration-200 transition-transform duration-200 ease-in-out " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
              </div>
          </div>
          <nav id="mobileNavbar" class="md:hidden bg-white dark:border-gray-700 dark:bg-gray-300">
            <ul class="flex justify-around">
              <li class="selected text-base py-3 text-center font-medium text-gray-500">Documentación</li>
              <li class=" py-3 text-center text-base font-medium text-gray-500">Código</li>
            </ul>
          </nav>
        </header>
        <main class="w-full max-h-screen overflow-hidden flex dark:bg-gray-900">
            <section id="documentationSection" class="max-h-screen md:block md:w-[40%] h-full overflow-y-auto">
                <div class="flex dark:bg-gray-800 flex-col bg-[#f5f9ff] p-6 gap-5">
                  <div class="flex items-center">
                    <h2 class="text-xl md:text-2xl font-semibold dark:text-white text-[#0a2463]">Documentación</h2>
                  </div>
                <div class="space-y-4">
                    <div class="flex flex-col">
                        <h3 class="text-lg md:text-xl dark:text-[#75aadb] text-[#0a2463] font-medium">Introducción</h3>
                        <p class="text-base dark:text-gray-300">
                        En nuestro país, la comida no es solo un placer, sino que también es una tradición que nos hace crear
                        momentos, quien no se comió un asado con su familia/amigos, tomó unos mates con bizcochitos en grupo,
                        etc... Este esolang está basado en recordar esos momentos mientras programas, cagarte un rato de risa
                        y enseñarle a tus amigos los mancos a programar👾.
                      </p>
                      <p class="text-base dark:text-gray-300">
                        Podrás encontrar expresiones, flujos de control, funciones, etc., los cuales llevan nombres de comidas típicas de nuestro país🍽.
                      </p>
                    </div>
                    <div class="flex flex-col gap-5">
                      <div>
                        <h3 class="text-lg md:text-xl text-[#0a2463] dark:text-[#75aadb] font-medium">Sintaxis</h3>
                        <p class="dark:text-gray-300">Antes de empezar a escribir código en (nombre del lenguaje), necesitas entender su estructura y las reglas básicas que rigen su sintaxis.</p>
                      </div>
                    </div>
                    <section id="docsContainer" class="flex flex-col gap-10">
                      <div class=" dark:text-red-400 dark:bg-red-900/20 flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                        <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span class="sr-only">Info</span>
                        <div>
                          <span class="font-medium">IMPORTANTE:</span><br/> 
                          <ul class="flex flex-col gap-2 pt-2">
                            <li class="text-xs md:text-base">
                              @ los semicolons no están permitidos al final de cada statement.
                            </li>
                            <li class="text-xs md:text-base">
                              @ los comentarios son solo en linea y se abren con un #.
                            </li>
                            <li class="text-xs md:text-base">
                              @ en los bloques de codigo dentro de un flujo de control que están dentro de una funcion, no se puede hacer un return vacio, si o si se tiene que retornar un valor.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </section>
            </section>
            <section id="codeSection" class="max-h-screen md:block flex-1 h-screen overflow-hidden relative overflow-y-auto w-full hidden">
                <div class="h-full dark:bg-[#121212] flex flex-col">
                  <div class="h-[50%] overflow-y-auto">
                    <div class="p-4 sticky top-0 flex justify-between bg-[#1E1E1E]">
                      <div>
                        <form class="max-w-sm mx-auto">
                          <select id="codeSnippetsSelect" class="block  w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          </select>
                        </form>
                      </div>
                      <div>
                        <button data-tooltip-target="tooltip-default" type="button" id="runCode" class="bg-[#75aadb] dark:bg-[#4a7fb3] dark:hover:bg-[#3d6a99] cursor-pointer hover:bg-[#6b9ac7] text-white p-2 rounded-xs items-end">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play h-4 w-4"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                        </button>
                        <button type="button" id="copyCode" class="text-[#75aadb] dark:text-[#75aadb] dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer bg-white hover:bg-gray-100 border-[1px] border-[#75aadb] border-solid p-2 rounded-xs items-end">
                          <svg class="w-4 h-4 text-blue-400 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div id="code" class="h-full w-full ">
                    </div>
                  </div>
                  <div id="console" class="h-[60%] dark:bg-gray-800 bg-gray-100 overflow-hidden">
                    <header>
                      <div class="py-2 px-4">
                        <ul>
                          <li>
                            <button id="clearConsole" class="bg-amber-300  dark:bg-amber-500 dark:hover:bg-amber-400  py-1 px-3 flex items-center gap-2 rounded-3xl text-sm hover:bg-amber-200 transition-colors duration-150 ease-in hover:ease-out hover:duration-100 hover:cursor-pointer">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                              <p>clear console</p>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </header>
                    <hr class="text-gray-200  dark:text-gray-900" />
                    <div class="pt-5 pl-5 pb-20 h-max max-h-full overflow-y-auto">
                      <ul id="consoleContent" class="flex flex-col gap-2 dark:text-gray-300">
                      </ul>
                    </div>
                  </div>
                </div>
            </section>
        </main>
`
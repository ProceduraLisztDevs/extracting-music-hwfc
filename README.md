# Read me right now

Hey! I'm so glad you made it. Welcome to this hell of a repository, for the official _ppvarga_ Honours Project as well as our Research Project.

In the following, I will be assuming that you understand the conceptual background of the project, regarding a rudimentary understanding of music theory and the WFC algorithm.

# Running the app

This application is written in TypeScript with React, and it is deployed using Vite (pronounced "veet" - I will get upset if you don't pronounce it like that). 

For managing dependencies, make sure you have Node.js and npm installed, you can check this with `node -v` and `npm -v`

Now, you can run `npm install` to install the libraries that this project depends on.

To run the app locally, use the command `npx vite` or `npm run dev`, both should achieve the same thing.This will also give you a URL on localhost, which now hosts your application. Any time you save a file in the project, it updates automatically! :) 

additionally, you should navigate to src\wfc\constraints\ConstraintInferrer\Server.py and run 'python Server.py'.The MidiAnalyser depends on this. It is important that you only have one instance if the app running, only http://127.0.0.1:5173/audio-wfc/ will work

Choosing the constraints that you wish to check on your uploaded song currently works in the same way as choosing the constraints when generating music, simply select it the constraint you wish to add and click 'add'. It is important to note that the MidiAnalyser is only compatible with HardConstraints, this is due to the fact that soft constraints in the original WFC model simply increase the chance that the generated music will adhere to that constraint. However, equivalent Hard constraints have been made for these (for example, the ascending melody soft constraint has an equivalent hard constraints)

Once you upload MIDI file, wait a few seconds (unless you have extremely lengthy songs this should not take more than 5 seconds). Afterwards, you can represent your data the analysis data in two ways. Either press the 'Generate Bar Chart' button to generate a bar chart. This bar chart sums up for each constraint how many measures adhere to that constraint. This is an effective way to quickly see which constraint is adhered to the most. There is also a download button that allows you to download this bar chart. Alternatively, you can press the 'Generate table' button which shows creates a table in which the y axis represents the measures of the song and the x axis the different constraints. A checkmark in the table represents that that measure adheres to that constraint and a cross represents that that measure does not adhere to the constraint. 

Important to note, the analysis is performed whenever a different midi file is uploaded (it happens on file change). For this reason, if you upload a file and analyse with a certain set of constraints, change the constraints, and then analyse again, then the results will not update. To fix this, simply upload some dummy MIDI file and then upload the original file again so you can analyse it with different constraints. 
# Project structure

If anything in the code behaves unexpectedly or you get stuck, don't hesitate to reach out! A lot of this code has ben patched together as I went, so it is natural that there are some unintuitive parts. If I did it in a weird way, either I had a good reason for it, or I wasn't smart enough to do it better. Either way, mainly for your own sanity, please don't introduce any structural changes before talking to me.

The base directory contains some meta stuff, I doubt you will have to change any of it. If you have any images or similar universal-access files, you should put them into the `public` directory. 

## The `src` directory

`App.tsx` contains the general layout of the app. You shouldn't define any components in here, you should do that in the `components` directory :0

`AppState.tsx` is responsible for storing and managing the state of the GUI and conversely, the state of the editor. If you want to introduce a new parameter, you should:
- add its signature to the `PassiveAppState` interface 
- in the body of the `AppState` function:
    - create a variable and a temporary setter callback for it with `useState` 
    - create an actual setter function from the temporary one (this is necessary for nice type signature compatibility)
    - add it to the `updateState` function
    - add both the variable and the setter callback to the return object
- if the parameter is relevant in chord prototypes and sections, put it (only!) into the `ChordPrototypeEnvironment` type. If it's not relevant in chord prototypes but it is in sections, put it into the `SectionEnvironment` type.
- if there are some easy checks for whether the value of this parameter is 'valid', please add them into the `errorsInAppState` function.

Now, you can use these parameters by calling the `useAppContext` function in your component and taking the relevant parameters from the massive object that it returns. See the `components` directory for example usage.

The rest of the files in the base of the `src` directory aren't too relevant. Let's break down the subdirectories!

### The `audio` subdirectory

This one should contain everything that has to do with going from the canvas representation to other, more commonly used audio representations (MIDI, mp3, etc.) and vice versa (looking at you, Chaan!)

For now, it only has a single file which is a bit messy, the library I found for building MIDI files is surprisingly difficult to use, let me know if you have any issues with it.

### The `components`  subdirectory

Here you can find all you GUI components, in `.tsx` files. If you're not super comfortable with React yet, no issue, just play around with the existing components and you'll get the hang of it in no time!

Try and reuse components as much as you can, and write ones which are reusable in more generic contexts.

### The `music_theory` subdirectory

This is where all of the music theory is provided for the internal logic of the constraints. Cool stuff, I'm proud of it.

### The `util`  subdirectory

Just a dump for miscallenious code that seems a bit too generic to put into any other subdirectory.

### The `wfc`  subdirectory

This is where the model resides. This is probably where we will spend most of our time in the live rundown, but afterwards it should be clear (also, I'm sorry, I don't really feel like writing everything out in here, I think telling you about it in person is way more efficient).

# This is it, I guess

hell yea
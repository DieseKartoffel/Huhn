# Hähnchenprogramm

An interface to manage the selling of chickens for my parents local store. A simple tool for private use. Also my first independent React project after a learning the framework. Dont expect high quality code (instead expect Bootstrap). Uses a localhost flask backend with a sqlite databse. Run the server with `python server.py` and the frontend with `npm start`.

# Build Process

- Delete previous "dist" folder if given
- pyinstaller will create new dist folder
- in dist folder we need folders "static" and "databse"
- static needs to be filled with react npm build, database can be empty

1. Build REACT app:
```
npm run build
``` 

2. create folder "static" (flask wants a folder named "static")

2. copy the react build from ./build into ./static (move subfolders and files up to this folder: "./build/static/*" -> "./static/*")

```
pip install pyinstaller
pyinstaller server.py --onefile
```

3. move "static" folder into "dist" folder with server.exe in it
 
4. create folder "database" in "dist"

You can now start server.exe to run the program and it will open the web frontend automatically.
# Pixel OS

## NodeJs driven software for ws281x-LED matrices

This is purposely designed to work with 12 by 12 led matrices using addressable LEDs from the ws281x family. With this you can show animations and play games on your diy screen using your phone or computer as controller. To run this software we recommend a raspberry pi and the following instructions are for exactly that so if you are using something else your installation instructions may vary.

## Usage

### Installation

1. Download and install the newest verion of nodejs

       $ curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
       $ sudo apt install nodejs
   
2. Check if everything installed successfully
    
       $ node --version
    
3. Clone the repository with

       $ git clone https://github.com/future-thinking/pixelos.git
       
4. cd into the cloned directory and run npm install not only in the main directory but also in the client directory

       $ cd pixelos
       $ npm install
       $ cd client
       $ npm install
       $ cd ..

### Configuration

Copy the contents of `.env.example` into an new file `.env` or just rename the file and adjust the values to your application.
Just remember this project was made for a 12x12 matrix and hasn't been tested nor optimised with any other sizes.

### Start the app

To start the software run

    $ npm run start

Optionally you can run this command with autostart on the pi. To do this click [here](https://learn.sparkfun.com/tutorials/how-to-run-a-raspberry-pi-program-on-startup/all) for a tutorial.

## Build

Checkout the parts and pictures on Printables.com
https://www.printables.com/model/226546-ikea-lack-led-matrix

## Development

This application is structured in modules which you can start from the web app.

Currently there are four modules: 

- Snake
   - classic snake game
   - up to 4 players 
- Rainbow
- Dancing Circles
- Flasher

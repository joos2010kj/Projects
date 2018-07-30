/*Schedule Overlapper
* Made by Hyekang Joo
* Started on Nov. 15, 2017
*/
import java.util.*;
import java.lang.*;
import java.io.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.util.Map.Entry;

public class Schedule {

    //SIDE is a square's side length.
    //SIDEandSPACE is a (square + mini space between each sqaure)'s side length

    private final int SIDE = 45, SIDEandSPACE = 50;
    private int SCREENSIZE_H = 700, SCREENSIZE_W = 700, dragInitI, dragFinI, dragInitJ, dragFinJ, clearInitI, clearInitJ, clearFinI, clearFinJ;
    private boolean drag = false, rush = false, clear = false, saved = false;
    private int schedule[][] = new int[24 * 60][7];
    private Rectangle displayedSchedule[][] = new Rectangle[12][7];
    private String color[][] = new String[12][7];
    private Status myStat;

    private Rectangle select = new Rectangle(0,0,SIDE,SIDE);            //used
    private String week[] = {"SUN","MON"," TUE","WED"," THU","  FRI"," SAT"};  //used
    private String time[] = new String[24 * 60];                               //used
    private String displayTime[] = new String[12];
    private Font f1 = new Font("TimesRoman", Font.PLAIN, 20);      //used
    private Font f2 = new Font("SansSerif",Font.BOLD, 50);
    private Font f3 = new Font("SansSerif",Font.BOLD,30);
    private Font f4 = new Font("Monospaced",Font.BOLD,10);
    private int top = 0, bottom = 12;
    private Comparer comparer = new Comparer();
    private boolean num0,num1,num2,num3,num4,num5,num6,num7,num8,num9;
    private String inputNum = "";
    private int sessionTime;

    private boolean cover1 = true, cover2 = false, cover3 = false, cover4 = false;
                    //cover1 is the main page (selection between schedule maker and overlapper)
                    //cover2 is the tutor vs client page (selection between client and tutor)
                    //cover3 is the session time input page
                    //cover4 is the overlapper-running page


    public Schedule(int height, int width){
        this.SCREENSIZE_H = height;
        this.SCREENSIZE_W = width;
    }

    public void drawCover(Graphics g){
        if(cover1 == true) {
            g.setFont(f1);
            g.setColor(Color.CYAN);
            g.fillRect(0, -20, SCREENSIZE_W, SCREENSIZE_H);
            g.setColor(Color.BLACK);
            g.drawRect(100, 300, 200, 100);
            g.drawRect(400, 300,200,100);
            g.drawString("Make a Schedule", 130, 350);
            g.drawString("Overlap the Schedules", 410, 350);

            g.setFont(f4);
            g.setColor(Color.MAGENTA);
            g.drawString("PRESS [ 1 ]",163,370);
            g.drawString("PRESS [ 2 ]",470,370);

            g.setFont(f1);
            g.setColor(Color.BLACK);
            g.drawString("Press \" C \" to Clear the Data", 230, 500);

            g.setFont(f2);
            g.setColor(Color.BLACK);
            g.drawString("Schedule Overlapper", 90,150);
            g.setFont(f1);


        }
        if(cover2 == true){
            g.setFont(f1);
            g.setColor(Color.CYAN);
            g.fillRect(0, -20, SCREENSIZE_W, SCREENSIZE_H);
            g.setColor(Color.BLACK);
            g.drawRect(100, 300, 200, 100);
            g.drawRect(400, 300,200,100);
            g.drawString("Client", 170, 350);
            g.drawString("Teacher", 470, 350);

            g.setFont(f4);
            g.setColor(Color.MAGENTA);
            g.drawString("PRESS [ 1 ]",163,370);
            g.drawString("PRESS [ 2 ]",470,370);

            g.setFont(f3);
            g.setColor(Color.BLACK);
            g.drawString("Choose One", 250,150);
            g.setFont(f1);
        }

        if(cover3 == true){
            g.setFont(f1);
            g.setColor(Color.CYAN);
            g.fillRect(0, -20, SCREENSIZE_W, SCREENSIZE_H);
            g.setColor(Color.BLACK);
            g.drawString("Please Type in the Length of a Session in Minutes", 140,240);
            g.drawString("* Takes Up to 3 Digits MAX.  Typing in Any More Will Clear the Box *", 50, 270);
            g.drawString("Minutes",315,380);
            g.drawString("* Hit ENTER once you are set *", 210, 420);
            g.setFont(f1);



            displayTime(g);
        }

        if(cover4 == true){
            g.setFont(f1);
            g.fillRect(0, -20, SCREENSIZE_W, SCREENSIZE_H);
            g.setColor(Color.BLACK);
            g.drawString("Please Wait", 200,240);
            g.drawString("" + sessionTime, 200, 260);

            if(comparer.isClientMustConflict() || comparer.isTutorMustConflict()) {
                if (comparer.isClientMustConflict()) {
                    g.drawString("The client's MUST time unfortunately is not available in the teacher's time.", 100, 200);
                    g.drawString(comparer.getGetDay() + ", " + comparer.getGetTime(), 100,300);
                }
                else if (comparer.isTutorMustConflict()) {
                    g.drawString("The teacher's MUST time unfortunately is not available in the client's time.", 100, 200);
                    g.drawString(comparer.getGetDay() + ", " + comparer.getGetTime(), 100,300);
                }
            }else{
                g.drawString("Matching session is available!",100,200);
            }
        }

    }

    public void displayTime(Graphics g){

        g.setColor(Color.BLACK);
        g.drawRect(310,300,80,40);

        g.setColor(Color.MAGENTA);
        g.setFont(f3);
        g.drawString(inputNum, 320,330);

        g.setFont(f1);

    }

    //Display Time on the left side
    public void drawTime(Graphics g){
        //write time starting from 0:00 AM to 11:59 PM
        int counter = 0;
        for(int i = 0; i < 24; i++){
            for(int j = 0; j < 60; j++) {
                //if it is 0:00 am to 11:59 am
                if(i < 12) {
                    //if minutewise time is between 0 and 10, then add "0" because it doesn't display as "01"
                    if (counter % 60 >= 0 && counter % 60 < 10) {
                        time[counter] = String.valueOf(i) + " : 0" + String.valueOf(j) + " a.m.";
                    } else { //else just display the number.  ex.) Not 014, just 14
                        time[counter] = String.valueOf(i) + " : " + String.valueOf(j) + " a.m.";
                    }
                    //Display the numbers stored inside
                   // g.drawString(time[counter], 0, counter * SIDEandSPACE);
                    counter++;
                }
                //if it is 12 o clock
                else if(i == 12){
                    //if minutewise time is between 0 and 10, then add "0" because it doesn't display as "01"
                    if (counter % 60 >= 0 && counter % 60 < 10) {
                        time[counter] = "12 : 0" + String.valueOf(j) + " p.m.";
                    } else { //else just display the number.  ex.) Not 014, just 14
                        time[counter] = "12 : " + String.valueOf(j) + " p.m.";
                    }
                    //Display the numbers stored inside
                    //g.drawString(time[counter], 0, counter * SIDEandSPACE);
                    counter++;
                }
                //if it is 1:00pm to 11:59 pm
                else if (i > 12){
                    //if minutewise time is between 0 and 10, then add "0" because it doesn't display as "01"
                    if (counter % 60 >= 0 && counter % 60 < 10) {
                        time[counter] = String.valueOf(i-12) + " : 0" + String.valueOf(j) + " p.m.";
                    } else { //else just display the number.  ex.) Not 014, just 14
                        time[counter] = String.valueOf(i-12) + " : " + String.valueOf(j) + " p.m.";
                    }
                    //Display the numbers stored inside
                    //g.drawString(time[counter], 0, counter * SIDEandSPACE);
                    counter++;
                }
            }
        }

        int temp = top;
        counter = 0;
        for(int i = 0; i < displayTime.length; i++){
            displayTime[i] = time[temp++];
            g.drawString(displayTime[i], 0, counter++ * SIDEandSPACE);
        }

    }

    //Display Days (Sun, Mon, Tues,...,Sat) on the top
    public void drawDays(Graphics g){
        g.setColor(Color.BLACK);
        g.setFont(f1);
        for(int i = 0; i < 7; i++){
            g.drawString(week[i],i * SIDEandSPACE, 0);
        }

    }

    public void drawPeripheral(Graphics g){
        g.setColor(Color.BLACK);
        g.drawString("1-Hour Jump: ", 0,0);
        g.drawString("[A]",35,20);
        if(rush){
            g.setColor(Color.GREEN);
            g.drawString("ON", 35,50);
        }
        else{
            g.setColor(Color.BLACK);
            g.drawString("OFF", 30,50);
        }


        g.setColor(Color.BLACK);
        g.drawString("Interval Mode: ", 0, 100);
        g.drawString("   [SHIFT]",0,120);
        if(drag){
            g.setColor(Color.GREEN);
            g.drawString("ON", 35,150);
        }
        else{
            g.setColor(Color.BLACK);
            g.drawString("OFF", 30,150);
        }


        g.setColor(Color.BLACK);
        g.drawString("Clear Mode: ", 0, 200);
        g.drawString("[C]",35,220);
        if(clear){
            g.setColor(Color.GREEN);
            g.drawString("ON", 35,250);
        }
        else{
            g.setColor(Color.BLACK);
            g.drawString("OFF", 30,250);
        }

        g.setColor(Color.BLACK);
        g.drawString("Save Data: ", 0, 300);
        g.drawString("[S]",35,320);
        if(saved){
            g.setColor(Color.GREEN);
            g.drawString("SAVED", 10,350);
        }
        else{
            g.setColor(Color.BLACK);
            g.drawString("NOT SAVED", 0,350);
        }

        g.setColor(Color.RED);
        g.drawString("RED: Available", 0, 450);
        g.setColor(Color.GREEN);
        g.drawString("GREEN: Preferred", 0, 500);
        g.setColor(Color.BLUE);
        g.drawString("BLUE: Must", 0 ,550);

    }


    //Display every single time cell
    public void drawCells(Graphics g) {
        g.setColor(Color.WHITE);

        //Display the certain 7 x 12 parts (displayedSchedule[][]) of schedule[][] array.
        /*  Also, by going over the top of displayedSchedule[][] array,
        //  the info in displayedSchedule[0][0] (say it stored the data of schedule[i][j])
        //  is replaced with the data in schedule[i-1][j].
        //  Similarly, going past the visible cell downwards will replace the cell with the new respective cell.
        //  i.e.) Make the picture look like the cells are all automatically updated as the user scrolls down and up.
        */


        int i_ = 0, j_ = 0;

        for(int i = 0; i < 7; i++) {
            for (int temp = top; temp < bottom; temp++) {
                if(schedule[temp][i] % 4 == 0){
                    color[i_++][j_] = "BLACK";
                }
                else if(schedule[temp][i] % 4 == 1){
                    color[i_++][j_] = "RED";
                }
                else if(schedule[temp][i] % 4 == 2){
                    color[i_++][j_] = "GREEN";
                }
                else if(schedule[temp][i] % 4 == 3){
                    color[i_++][j_] = "BLUE";
                }
            }

            i_ = 0;
            j_ += 1;
        }

        i_ = 0;
        j_ = 0;

        for(int i = 0 ;i < displayedSchedule[0].length; i++){
            for(int j = 0; j < displayedSchedule.length; j++){
                displayedSchedule[j][i] = new Rectangle(i * SIDEandSPACE, j * SIDEandSPACE, SIDE, SIDE);
                if(color[i_][j_].equals("BLACK")){
                    g.setColor(Color.BLACK);
                }
                else if(color[i_][j_].equals("GREEN")){
                    g.setColor(Color.GREEN);
                }
                else if(color[i_][j_].equals("BLUE")){
                    g.setColor(Color.BLUE);
                }
                else if(color[i_][j_].equals("RED")){
                    g.setColor(Color.RED);
                }
                i_++;

                g.fillRect(displayedSchedule[j][i].x,displayedSchedule[j][i].y,
                        displayedSchedule[j][i].width,displayedSchedule[j][i].height);

            }
            j_++;
            i_ = 0;
        }


    }

    //Display my selected cell
    public void drawSelected(Graphics g){
        Graphics2D g2 = (Graphics2D) g;
        g2.setStroke(new BasicStroke(10));
        g.setColor(Color.ORANGE);
        g2.drawRect(select.x,select.y,select.width,select.height);
    }

    public void displayStatus(Graphics g){
        g.setColor(Color.BLACK);
        g.drawString("My Status:", 10,10);
        g.setColor(Color.WHITE);
        if(myStat == null){
            g.drawString("Not selected yet", 10, 30);
            g.drawString("Press 1 for Client", 10, 50);
            g.drawString("Press 2 for Teacher", 10,70);
        }
        else if(myStat == Status.TEACHER){
            g.drawString("Teacher", 10,30);
        }
        else if(myStat == Status.CLIENT){
            g.drawString("Client",10,30);
        }
    }

    public boolean getCover3(){
        return cover3;
    }

    public void keyPressed(KeyEvent e){
        int key = e.getKeyCode();
        if(key == e.VK_RIGHT){
            saved = false;
            if(select.x >= SIDEandSPACE * 7 - SIDEandSPACE){
                select.x = SIDEandSPACE * 7 - SIDEandSPACE;
            }
            else {
                select.x += SIDEandSPACE;
            }
        }

        if(key == e.VK_DOWN){
            //if the y-coordinate of upper right corner of the SELECT sqaure is greater than 500 - 50...
            saved = false;
            if(select.y >= SCREENSIZE_H - SIDEandSPACE - 100){
                select.y = SCREENSIZE_H - SIDEandSPACE - 100;

                if(bottom == schedule.length - 1){

                }
                else {
                    if(rush == true){
                        if(bottom + 60 > schedule.length){
                            bottom = schedule.length;
                            top = bottom - 12;
                        }
                        else {
                            bottom += 60;
                            top += 60;
                        }
                    }
                    else {
                        bottom += 1;
                        top += 1;
                    }
                }
                //
            }
            else {
                select.y += SIDEandSPACE;
            }
        }

        if(key == e.VK_LEFT){
            saved = false;
            if(select.x <= 0){
                select.x = 0;
            }
            else {
                select.x -= SIDEandSPACE;
            }
        }

        if(key == e.VK_UP){
            //if the y-coordinate of upper right corner of the SELECT sqaure is less than 150...
            saved = false;
            if(select.y <= 0){
                select.y = 0;
                if(top == 0){

                }
                else {
                    if(rush == true){
                        if(top - 60 < 0){
                            top = 0;
                            bottom = top + 12;
                        }
                        else {
                            bottom -= 60;
                            top -= 60;
                        }
                    }
                    else {
                        bottom -= 1;
                        top -= 1;
                    }
                }
            }
            else {
                select.y -= SIDEandSPACE;
            }
        }

        if(key == e.VK_SPACE){
            schedule[(select.y / SIDEandSPACE) + top][(select.x / SIDEandSPACE)]++;
        }

        if(key == e.VK_SHIFT){
            if(!drag) {
                dragInitI = (select.y / SIDEandSPACE) + top;
                dragInitJ = select.x / SIDEandSPACE;
                drag = true;
            }
            else{

                dragFinI = (select.y / SIDEandSPACE) + top;
                dragFinJ = select.x / SIDEandSPACE;

                if(dragInitJ == dragFinJ) {

                    if(dragInitI == dragFinI){

                    }
                    else {
                        if(dragInitI < dragFinI) {
                            for (int i = dragInitI; i <= dragFinI; i++) {
                                schedule[i][dragInitJ]++;
                            }
                        }
                        else if(dragInitI > dragFinI){
                            for (int i = dragFinI; i <= dragInitI; i++) {
                                schedule[i][dragInitJ]++;
                            }
                        }
                    }
                }


                drag = false;
            }
        }




        if(key == e.VK_C){

            if(cover1 == true && cover2 == false && cover3 == false && cover4 == false) {
                DataWriter datawriter = new DataWriter(Status.ERASER);
                datawriter.openFile();
                datawriter.record();
                datawriter.closeFile();
            }else {
                if (!clear) {
                    clearInitI = (select.y / SIDEandSPACE) + top;
                    clearInitJ = select.x / SIDEandSPACE;
                    clear = true;
                } else {

                    clearFinI = (select.y / SIDEandSPACE) + top;
                    clearFinJ = select.x / SIDEandSPACE;

                    if (clearInitJ == clearFinJ) {
                        if (clearInitI < clearFinI) {
                            for (int i = clearInitI; i <= clearFinI; i++) {
                                schedule[i][clearInitJ] = 0;
                            }
                        } else if (clearInitI > clearFinI) {
                            for (int i = clearFinI; i <= clearInitI; i++) {
                                schedule[i][clearInitJ] = 0;
                            }
                        }
                    }
                    clear = false;

                }
            }
        }


        if(key == e.VK_A){
            if(rush == false){
                rush = true;
            }
            else{
                rush = false;
            }
        }

        if(key == e.VK_Q){
            rush = false;
            clear = false;
            drag = false;

        }

        if(key == e.VK_S){
            if(myStat == null){

            }
            else {
                DataWriter datawriter = new DataWriter(myStat);
                datawriter.openFile();
                datawriter.record();
                datawriter.closeFile();
                saved = true;
            }
        }

        if(key == e.VK_1){

            if(cover1 == true && cover2 == false && cover3 == false){
                cover1 = false;
                cover2 = true;
            }
            else if(cover1 == false && cover2 == true && cover3 == false){
                cover2 = false;
                if (myStat == null) {
                    myStat = Status.CLIENT;
                } else {

                }
            }
            else if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                num1 = true;
                this.modNumber();

            }
        }

        if(key == e.VK_2){
            if(cover1 == true && cover2 == false && cover3 == false){
                cover1 = false;
                cover3 = true;


                comparer.openFile();
                comparer.readFile();
                //comparer.display();  //remove this line if you want this program to not display the numbers.
                comparer.closeFile();
            }
            else if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                //What you are writing here is what is happening when the user pressed 2
                num2 = true;
                this.modNumber();

            }
            else{
                cover2 = false;
                if (myStat == null) {
                    myStat = Status.TEACHER;
                } else {

                }
            }
        }

        if(key == e.VK_3){
            if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                num3 = true;
                this.modNumber();

            }
        }

        if(key == e.VK_4){
            if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                num4 = true;
                this.modNumber();

            }
        }

        if(key == e.VK_5){
            if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                num5 = true;
                this.modNumber();

            }
        }

        if(key == e.VK_6){
            if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                num6 = true;
                this.modNumber();

            }
        }

        if(key == e.VK_7){
            if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                num7 = true;
                this.modNumber();

            }
        }

        if(key == e.VK_8){
            if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                num8 = true;
                this.modNumber();

            }
        }

        if(key == e.VK_9){
            if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                num9 = true;
                this.modNumber();

            }
        }

        if(key == e.VK_0){
            if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 3 now.
                num0 = true;
                this.modNumber();

            }
        }

        if(key == e.VK_ENTER){

            //if you were on cover 3...
            if(cover1 == false && cover2 == false && cover3 == true) {
                //You are on the cover 4 now.


                /*
                * Make a new String variable SessionTime and store the inputNum value to the new String var SessionTime once
                * the user hits ENTER.   O
                * Next, make a blank cover4 page that displays the result, and take the user to the cover4 page.  O
                * Make sure SessionTime cannot be changed once the user is out of cover3.
                *
                **/
                int counter = 0;

                cover3 = false;
                cover4 = true;

                sessionTime = Integer.parseInt(inputNum);


                comparer.MUSTanalyzer();
                comparer.SIDEanalyzer();

                for(int m = 0 ; m < 7; m++) {
                    System.out.println(
                                    week[m] + "\n" +
                                    comparer.getIntervals()[counter++][m] + "\n" +
                                    comparer.getIntervals()[counter++][m] + "\n" +
                                    comparer.getIntervals()[counter][m]
                    );
                    counter = 0;
                }

                //comparer.display();

            }
        }

    }


    public void modNumber(){
        if(inputNum.length() + 1 > 3){
            inputNum = "";
        }
        else {
            if (num0 == true) {
                inputNum += "0";
                num0 = false;
            } else if (num1 == true) {
                inputNum += "1";
                num1 = false;
            } else if (num2 == true) {
                inputNum += "2";
                num2 = false;
            } else if (num3 == true) {
                inputNum += "3";
                num3 = false;
            } else if (num4 == true) {
                inputNum += "4";
                num4 = false;
            } else if (num5 == true) {
                inputNum += "5";
                num5 = false;
            } else if (num6 == true) {
                inputNum += "6";
                num6 = false;
            } else if (num7 == true) {
                inputNum += "7";
                num7 = false;
            } else if (num8 == true) {
                inputNum += "8";
                num8 = false;
            } else if (num9 == true) {
                inputNum += "9";
                num9 = false;
            }
        }

        num0 = num1 = num2 = num3 = num4 = num5 = num6 = num7 = num8 = num9 = false;
    }









    class DataWriter {
        private Formatter sys, eraseSys;
        private String fileName,eraserFile;
        private boolean erase = false;

        public DataWriter(Status stat){
            if(stat == Status.CLIENT){
                fileName = "ClientSchedule.txt";
            }
            else if(stat == Status.TEACHER){
                fileName = "TutorSchedule.txt";
            }
            else if(stat == Status.ERASER){
                fileName = "ClientSchedule.txt";
                eraserFile = "TutorSchedule.txt";
                erase = true;
            }
        }
        public void openFile(){
            try{
                sys = new Formatter(fileName);
                if(erase == true){
                    eraseSys = new Formatter(eraserFile);
                }

            }catch(Exception e){
                System.out.print("Error");
            }
        }

        public void record(){
            if(erase == true) {

                int counter = 0, len = schedule[0].length;
                for (int i = 0; i < schedule.length; i++) {
                    sys.format("%s %s %s %s %s %s %s\n", schedule[i][counter++ % len], schedule[i][counter++ % len],
                            schedule[i][counter++ % len], schedule[i][counter++ % len],
                            schedule[i][counter++ % len], schedule[i][counter++ % len],
                            schedule[i][counter++ % len]);

                    eraseSys.format("%s %s %s %s %s %s %s\n", 0, 0, 0, 0, 0, 0, 0);
                }
            }
            else {
                int counter = 0, len = schedule[0].length;
                for (int i = 0; i < schedule.length; i++) {
                    sys.format("%s %s %s %s %s %s %s\n", schedule[i][counter++ % len], schedule[i][counter++ % len],
                            schedule[i][counter++ % len], schedule[i][counter++ % len],
                            schedule[i][counter++ % len], schedule[i][counter++ % len],
                            schedule[i][counter++ % len]);

                }
            }
        }

        public void closeFile(){
            sys.close();
            if(erase == true){
                eraseSys.close();
            }
        }

    }










    class Comparer {
        private Scanner sys1, sys2;
        private int[][] tutorSchedule = new int[24 * 60][7], clientSchedule = new int[24 * 60][7];
        private int stage;
        private boolean tutorMustConflict = false, clientMustConflict = false;
        private Map<Integer, String> mapI = new HashMap<>();
        private Map<Integer, String> mapJ = new HashMap<>();
        private HashMap<Integer,Integer> indClient = new HashMap<>();
        private HashMap<Integer,Integer> indTutor = new HashMap<>();
        private HashMap<Integer,Integer> top3Picks = new HashMap<>();
        private ArrayList<Integer> total = new ArrayList<Integer>();
        private String getTime = "", getDay = "";
        private String[][] intervals = new String[3][7];

        public Comparer(){
            for(int i = 0; i < 24 * 60; i++){

                //if minute points to any time between 0 and 9, inclusive...
                if(i % 60 >= 0 && i % 60 < 10 ){
                    //then add "0" before the minute number is printed
                    mapI.put(i, String.valueOf( (i/60) ) + " : 0" + String.valueOf(i % 60) );
                }
                else {
                    //else, just print the number
                    mapI.put(i, String.valueOf( (i / 60) ) + " : " + String.valueOf(i % 60) );
                }
            }

            mapJ.put(0,"Sunday");
            mapJ.put(1,"Monday");
            mapJ.put(2,"Tuesday");
            mapJ.put(3,"Wednesday");
            mapJ.put(4,"Thursday");
            mapJ.put(5,"Friday");
            mapJ.put(6,"Saturday");
        }

        public void openFile(){
            try{
                sys1 = new Scanner(new File("ClientSchedule.txt"));
                sys2 = new Scanner(new File("TutorSchedule.txt"));

            }catch(Exception e){
                System.out.print("Error");
            }
        }

        public void readFile(){
            int i = 0, j = 0;
            while(sys1.hasNext()){
                clientSchedule[i][j % 7] = Integer.parseInt(sys1.next());
                j++;
                if( j % 7 == 0){
                    i++;
                }
            }

            i = 0;
            j = 0;

            while(sys2.hasNext()){
                tutorSchedule[i][j % 7] = Integer.parseInt(sys2.next());
                j++;
                if( j % 7 == 0){
                    i++;
                }
            }
        }

        public void closeFile(){
            sys1.close();
            sys2.close();
        }




        public void MUSTanalyzer() {
            //Compares MUST info
            for (int i = 0; i < schedule.length; i++) {
                for (int j = 0; j < schedule[0].length; j++) {

                    //if MUST doesn't match
                    if (tutorSchedule[i][j] % 4 == 3) {
                        if (tutorSchedule[i][j] % 4 != clientSchedule[i][j] % 4) {
                            tutorMustConflict = true;

                            getTime = mapI.get(i);
                            getDay = mapJ.get(j);
                            return;
                        }
                    }
                    else if(clientSchedule[i][j] % 4 == 3){
                        if(clientSchedule[i][j] % 4 != tutorSchedule[i][j] % 4){
                            clientMustConflict = true;

                            getTime = mapI.get(i);
                            getDay = mapJ.get(j);
                            return;
                        }
                    }

                }
            }

        }

        public void SIDEanalyzer() {
            //Compares Preferred and Available Info
            for(int j = 0; j < 7; j++) {


                //int j = 0; //once Sunday work is complete, change this variable into for loop.

                int clientSum = 0, tutorSum = 0, counter = 0, top = 0, bottom = sessionTime,
                        second, secondInd, third, thirdInd, largest, largestInd;

                HashMap<Integer, Integer> unsortedCombo = new HashMap<>();

                boolean mayContinue = true;

                for (int i = 0; i < sessionTime; i++) {
                    clientSum += clientSchedule[i][j] % 4;
                    tutorSum += tutorSchedule[i][j] % 4;

                    if (clientSchedule[i][j] == 0 || tutorSchedule[i][j] == 0) {
                        mayContinue = false;
                    }
                }

                while (true) {
                    if (bottom >= 24 * 60) {
                        break;
                    }

                    mayContinue = true;

                    for (int k = top; k < bottom; k++) {
                        if (clientSchedule[k][j] == 0 || tutorSchedule[k][j] == 0) {
                            mayContinue = false;
                            break;
                        }
                    }


                    if (mayContinue == true) {
                        indClient.put(counter, clientSum);
                        indTutor.put(counter, tutorSum);
                        unsortedCombo.put(counter, clientSum + tutorSum);
                    }


                    counter++;

                    clientSum -= clientSchedule[top][j] % 4;
                    clientSum += clientSchedule[bottom][j] % 4;

                    tutorSum -= tutorSchedule[top][j] % 4;
                    tutorSum += tutorSchedule[bottom][j] % 4;

                    top++;
                    bottom++;

                }


                largest = second = third = 0;
                largestInd = secondInd = thirdInd = -1;

                for (int i = 0; i < 3; i++) {
                    stage = i;
                    for (int q = 0; q < counter; q++) {
                        if (unsortedCombo.get(q) != null) {
                            int thisNum = unsortedCombo.get(q);
                            if (stage == 0) {
                                if (Math.max(thisNum, largest) == thisNum) {
                                    largest = thisNum;
                                    largestInd = q;
                                }
                            } else if (stage == 1) {
                                if (second < thisNum && thisNum <= largest) {
                                    if (q != largestInd && q != thirdInd) {
                                        second = thisNum;
                                        secondInd = q;
                                    }
                                }
                            } else if (stage == 2) {
                                if (third < thisNum && thisNum <= second) {
                                    if (q != largestInd && q != secondInd) {
                                        third = thisNum;
                                        thirdInd = q;
                                    }
                                }
                            }
                        }
                    }
                }

                counter = 0;

                if (largestInd == -1) {
                    intervals[counter][j] = "NONE";
                } else {
                    top3Picks.put(1, largestInd);   //first place index
                    intervals[counter][j] = timeframe(top3Picks.get(1)) + " - " + timeframe(top3Picks.get(1) + sessionTime);
                }

                counter++;

                if (secondInd == -1) {
                    intervals[counter][j] = "NONE";
                } else {
                    top3Picks.put(2, secondInd);    //second place index
                    intervals[counter][j] = timeframe(top3Picks.get(2)) + " - " + timeframe(top3Picks.get(2) + sessionTime);
                }

                counter++;

                if (thirdInd == -1) {
                    intervals[counter][j] = "NONE";
                } else {
                    top3Picks.put(3, thirdInd);     //third place index
                    intervals[counter][j] = timeframe(top3Picks.get(3)) + " - " + timeframe(top3Picks.get(3) + sessionTime);
                }

                /*
                for (int i = 0; i < 1440; i++) {
                    if (unsortedCombo.get(i) != null)
                        System.out.println(i + ": " + unsortedCombo.get(i));
                }
                */

            }

        }

        public String timeframe(int i){
            //if it's afternoon
            if(i/60 > 12){
                //if minute points to any time between 0 and 9, inclusive...
                if(i % 60 >= 0 && i % 60 < 10 ){
                    //then add "0" before the minute number is printed
                    return String.valueOf( (i/60) - 12 ) + " : 0" + String.valueOf(i%60) + " p.m.";
                }
                else {
                    //else, just print the number
                    return String.valueOf( (i / 60) - 12) + " : " + String.valueOf(i % 60) + " p.m.";
                }
            }else if(i / 60 == 0){ //if the hour points to 0, that is, midnight...
                //if minute points to any time between 0 and 9, inclusive...
                if(i % 60 >= 0 && i % 60 < 10 ){
                    //then add "0" before the minute number is printed
                    return "12 : 0" + String.valueOf(i % 60) + " a.m.";
                }
                else {
                    return "12 : " + String.valueOf(i % 60) + " a.m.";
                }
            }
            else {//ELSE: if hour points to any time before afternoon and past midnight (1:00 am to 11:59 am)...
                if(i % 60 >= 0 && i % 60 < 10 ) {
                    return String.valueOf(i / 60) + " : 0" + String.valueOf(i % 60) + " a.m.";
                }else {
                    return String.valueOf(i / 60) + " : " + String.valueOf(i % 60) + " a.m.";
                }
            }

        }

        public String[][] getIntervals(){
            return intervals;
        }


        public boolean isClientMustConflict() {
            return clientMustConflict;
        }

        public boolean isTutorMustConflict() {
            return tutorMustConflict;
        }

        public String getGetTime(){
            return getTime;
        }

        public String getGetDay() {
            return getDay;
        }

        public void display(){
            System.out.println(indClient.size());
            System.out.println();

            for(int i = 0; i < indClient.size(); i++){

            }

            /*
            for(int i = 0; i < indTutor.size(); i++){
                //Left side is the client's data
                System.out.print(indClient.get(i));

                System.out.print("   ");

                //Right side is the tutor's data
                System.out.print(indTutor.get(i));

                System.out.println();
            }
            */

        }

        /*
        public void display(){
            for(int i = 0; i < tutorSchedule.length; i++){


                //Left side is the client's data
                for(int j = 0; j < clientSchedule[0].length; j++){
                    System.out.print(clientSchedule[i][j] + " ");
                }

                System.out.print("   ");

                //Right side is the tutor's data
                for(int j = 0; j < tutorSchedule[0].length; j++){
                    System.out.print(tutorSchedule[i][j] + " ");
                }

                System.out.println();
            }
        }
        */
    }





}

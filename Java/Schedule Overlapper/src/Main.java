/*Schedule Overlapper
* Made by Hyekang Joo
* Started on Nov. 15, 2017
*/

import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class Main extends JFrame {

    private Image dbImage;
    private Graphics dbg;
    private int height, width;
    static Schedule schedule = new Schedule(700,700);


    @Override
    public void paintComponents(Graphics g) {

        g.translate(0, 30);
        schedule.displayStatus(g);

        g.translate(150, 40);
        schedule.drawDays(g);

        g.translate(-100, 60);
        schedule.drawTime(g);

        g.translate(100, -30);
        schedule.drawCells(g);
        schedule.drawSelected(g);

        g.translate(370, 15);
        schedule.drawPeripheral(g);

        g.translate(-520, -75);
        schedule.drawCover(g);

        repaint();
    }

    public class AL extends KeyAdapter{
        public void keyPressed(KeyEvent e){
            schedule.keyPressed(e);
        }
    }

    public Main(){
         width = 700;
         height = 700;

        setBackground(Color.GRAY);
        setVisible(true);
        setTitle("Schedule Overlapper");
        setResizable(false);
        setSize(width,height);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        addKeyListener(new AL());
    }

    public static void main(String[] args) {

        Main main = new Main();

    }


    @Override
    public void paint(Graphics g) {
        dbImage = createImage(getWidth(),getHeight());
        dbg = dbImage.getGraphics();
        paintComponents(dbg);
        g.drawImage(dbImage,0,0,this);
    }


}


/*
* WHERE I LEFT OFF:
* Line 133 of Schedule Class.
*
* What I need to do:
* Display the available session times on the GUI.
* Check to make sure the Comparer is working PERFECTLY fine.  No error?
* Edit MUST portion to make sure MUST functions properly (* No session if one's MUST doesn't overlap with the other's)
* Finish up with Comparer Class.
* Make a message like "Did you save your file" pop up when the user closes the file.
* Load the saved file.
* Auto-save feature on close
 */
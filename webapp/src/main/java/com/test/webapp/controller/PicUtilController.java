package com.test.webapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.test.neo4j.domain.Picture;
import com.test.neo4j.model.PictureQo;
import com.test.neo4j.service.PictureService;
import com.test.webapp.service.AsyncThreadPool;
import com.test.webapp.service.FastefsClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.CropImageFilter;
import java.awt.image.FilteredImageSource;
import java.awt.image.ImageFilter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/pic")
public class PicUtilController {
    @Value("${file.path.head:http://192.168.1.214:84/}")
    private String pathHead;
    @Autowired
    private PictureService pictureService;
    @Autowired
    private FastefsClient fastefsClient;

    //可缩放图片上传
    @RequestMapping("/upload")
    public String upload() {
        return "pic/upload-pic";
    }


    //普通图片上传
    @RequestMapping("/uploadfile")
    public String uploadBlue() {
        return "pic/upload";
    }


    /**
     * 上传图片
     * @return
     */
    @RequestMapping(value = "/uploadPic", method = RequestMethod.POST)
    public void uploadPic(@RequestParam("pictureFile") MultipartFile multipartFile,HttpServletRequest request,HttpServletResponse response) {
        try {
            String filename = fastefsClient.uploFile(multipartFile);
            Long shopid = 1L;

            AsyncThreadPool.getInstance().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        savePic(multipartFile, filename ,shopid);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });

            BufferedImage image = ImageIO.read(multipartFile.getInputStream());

            Map<String, Object> data = new HashMap<String, Object>();
            data.put("pathInfo", pathHead+filename);
            data.put("width", image.getWidth());
            data.put("height", image.getHeight());

            ObjectMapper mapper = new ObjectMapper();
            String ret =  mapper.writeValueAsString(data);

            response.setContentType("text/html;charset=utf8");
            response.getOutputStream().write(ret.getBytes());
            response.flushBuffer();
        }catch (IOException e){
            e.printStackTrace();
        }

    }


    /**
     * 剪切图片
     * @return
     */
    @RequestMapping(value = "/cutPic", method = RequestMethod.POST)
    @ResponseBody
    public void cutPic(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String fileUrl = request.getParameter("fileUrl"),
                left_up = request.getParameter("left_up"),
                right_bottom = request.getParameter("right_bottom");
        String[] startXY = left_up.split(","), maxPoint = right_bottom.split(",");
        int x = Integer.parseInt(startXY[0]), y = Integer.parseInt(startXY[1]);
        int l_y = Integer.parseInt(maxPoint[1]);
        int r_x = Integer.parseInt(maxPoint[0]);
        int w = r_x - x;
        int h = l_y - y;

        URL url = new URL(fileUrl);
        BufferedImage image = ImageIO.read(url);
        BufferedImage out = this.cropImg(image, x, y, w, h);

        String imageType = this.getImageType(fileUrl);
        ByteArrayOutputStream imgoutStream = new ByteArrayOutputStream();
        ImageIO.write(out, imageType, imgoutStream);

        byte[] imageBytes = imgoutStream.toByteArray();

        fastefsClient.deleteFile(fileUrl.replace(pathHead, ""));


        InputStream is = new ByteArrayInputStream(imgoutStream.toByteArray());
        Long size = new Long(imageBytes.length);
        String newfile = fastefsClient.uploFile(is, size, imageType);


        Long shopid = 1L;
        AsyncThreadPool.getInstance().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    updatePic(out, shopid, newfile, fileUrl.replace(pathHead, ""));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("pathInfo", pathHead + newfile);
        data.put("width", image.getWidth());
        data.put("height", image.getHeight());

        response.setContentType("text/html;charset=utf8");
        ObjectMapper mapper = new ObjectMapper();
        String ret =  mapper.writeValueAsString(data);

        response.getOutputStream().write(ret.getBytes());
        response.flushBuffer();

    }


    @RequestMapping(value = "/listPic", method = RequestMethod.POST)
    @ResponseBody
    public Page<Picture> listPic(PictureQo pictureQo) throws IOException{
        Long shopid = 1L;
        pictureQo.setShopid(shopid);
        return pictureService.findPage(pictureQo);
    }

    /**
     * 切图
     * @param src
     * @param x
     * @param y
     * @param w
     * @param h
     * @return
     */
    private BufferedImage cropImg(BufferedImage src, int x, int y, int w, int h) {
        ImageFilter cropFilter = new CropImageFilter(x, y, w, h);
        Image img = Toolkit.getDefaultToolkit().createImage(new FilteredImageSource(src.getSource(), cropFilter));
        BufferedImage newImg = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Graphics g = newImg.getGraphics();
        g.drawImage(img, 0, 0, null);
        g.dispose();
        return newImg;

    }

    /**
     * 获取图片类型
     * @param url
     * @return
     */
    private String getImageType(String url) {
        int lastindex = url.lastIndexOf("/");
        String imgName = url.substring(lastindex + 1);
        int pointIndex = imgName.indexOf(".");
        return imgName.substring(pointIndex + 1);
    }

    //ueditor 图片上传
    @RequestMapping(value = "/uploadimg", method=RequestMethod.POST, produces="text/html;charset=UTF-8")
    public void uploadimg(@RequestParam("upfile") MultipartFile upfile,HttpServletRequest request,HttpServletResponse response){
        try {
            String filename = fastefsClient.uploFile(upfile);

           Long shopid = 1L;

            AsyncThreadPool.getInstance().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        savePic(upfile, filename ,shopid);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });

            Map<String, Object> data = new HashMap<String, Object>();
            data.put("original", upfile.getOriginalFilename());
            data.put("url", pathHead+filename);
            data.put("title", "");
            data.put("state", "SUCCESS");

            ObjectMapper mapper = new ObjectMapper();
            String ret =  mapper.writeValueAsString(data);

            response.setContentType("text/html;charset=utf8");
            response.getOutputStream().write(ret.getBytes());
            response.flushBuffer();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "/deletePic", method = RequestMethod.POST)
    @ResponseBody
    public String deletePic(HttpServletRequest request) {
        try {
            String fullfile = request.getParameter("filename");
            if(!StringUtils.isEmpty(fullfile)) {
                String filename = fullfile.replace(pathHead, "");
                fastefsClient.deleteFile(filename);
                AsyncThreadPool.getInstance().execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            delPic(filename);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return "1";
    }

    private void delPic(String filename){
        Picture picture = pictureService.findByName(filename);
        pictureService.delete(picture);
    }

    private void savePic(MultipartFile multipartFile, String filename, Long shopid) throws Exception{
        BufferedImage image = ImageIO.read(multipartFile.getInputStream());

        Picture picture = new Picture();
        picture.setFileName(filename);
        picture.setHeight(image.getHeight());
        picture.setWidth(image.getWidth());
        picture.setPathInfo(pathHead);
        picture.setCreate(new Date());
        picture.setShopid(shopid);

        pictureService.create(picture);
    }

    private void updatePic(BufferedImage image, Long shopid, String filename, String oldfile) throws Exception{
        Picture olepic = pictureService.findByName(oldfile);
        pictureService.delete(olepic);

        Picture picture = new Picture();
        picture.setFileName(filename);
        picture.setHeight(image.getHeight());
        picture.setWidth(image.getWidth());
        picture.setPathInfo(pathHead);
        picture.setCreate(new Date());
        picture.setShopid(shopid);

        pictureService.create(picture);
    }
}

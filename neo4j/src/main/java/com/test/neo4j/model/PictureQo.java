package com.test.neo4j.model;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

public class PictureQo extends PageQo {
    private Long id;
    private String fileName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date create;
    private Long shopid;

    public PictureQo() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Date getCreate() {
        return create;
    }

    public void setCreate(Date create) {
        this.create = create;
    }

    public Long getShopid() {
        return shopid;
    }

    public void setShopid(Long shopid) {
        this.shopid = shopid;
    }
}

package com.test.neo4j.model;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

public class GoodsQo extends PageQo {
    private Long id;
    private String name;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date create;

    public GoodsQo() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }



    public Date getCreate() {
        return create;
    }

    public void setCreate(Date create) {
        this.create = create;
    }
    
}

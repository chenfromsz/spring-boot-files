package com.test.neo4j.test;

import com.test.neo4j.AppForTest;
import com.test.neo4j.config.Neo4jConfig;
import com.test.neo4j.domain.Goods;
import com.test.neo4j.service.GoodsService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import java.util.Date;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {Neo4jConfig.class, AppForTest.class})
@SpringBootTest
public class DataTest {
    private static Logger logger = LoggerFactory.getLogger(DataTest.class);

    @Autowired
    GoodsService goodsService;

    @Test
    public void add() throws Exception{
        Goods goods = new Goods();
        goods.setName("测试商品");
        goods.setBrief("简要");
        goods.setContents("商品描述");
        goods.setPrice("12.00");
        goods.setCreate(new Date());
        goodsService.create(goods);
        Assert.notNull(goods.getId(), "create error");
    }
}

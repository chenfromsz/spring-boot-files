package com.test.neo4j.test;

import com.test.neo4j.config.Neo4jConfig;
import com.test.neo4j.domain.Goods;
import com.test.neo4j.repositories.GoodsRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import java.util.Date;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {Neo4jConfig.class})
public class DataTest {
    private static Logger logger = LoggerFactory.getLogger(DataTest.class);

    @Autowired
    GoodsRepository goodsRepository;

    @Test
    public void add() throws Exception{
        Goods goods = new Goods();
        goods.setName("测试商品");
        goods.setBrief("简要");
        goods.setContents("商品描述");
        goods.setPrice("12.00");
        goods.setCreate(new Date());
        goodsRepository.save(goods);
        Assert.notNull(goods.getId());
    }
}

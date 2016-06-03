package com.test.neo4j.service;

import com.test.neo4j.domain.Goods;
import com.test.neo4j.model.GoodsQo;
import com.test.neo4j.repositories.GoodsRepository;
import org.neo4j.ogm.cypher.BooleanOperator;
import org.neo4j.ogm.cypher.ComparisonOperator;
import org.neo4j.ogm.cypher.Filter;
import org.neo4j.ogm.cypher.Filters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class GoodsService {
    @Autowired
    private GoodsRepository goodsRepository;
    @Autowired
    private PagesService<Goods> pagesService;

    public Goods findById(Long id) {
        return goodsRepository.findOne(id);
    }

    public Goods create(Goods goods) {
        return goodsRepository.save(goods);
    }

    public Goods update(Goods goods) {
        return goodsRepository.save(goods);
    }

    public void delete(Long id) {
        Goods goods = goodsRepository.findOne(id);
        goodsRepository.delete(goods);
    }

    public Iterable<Goods> findAll(){
        return goodsRepository.findAll();
    }

    public Page<Goods> findPage(GoodsQo goodsQo){
        Pageable pageable = new PageRequest(goodsQo.getPage(), goodsQo.getSize(), new Sort(Sort.Direction.ASC, "id"));

        Filters filters = new Filters();
        if (!StringUtils.isEmpty(goodsQo.getName())) {
            Filter filter = new Filter("name", goodsQo.getName());
            filters.add(filter);
        }
        if (!StringUtils.isEmpty(goodsQo.getCreate())) {
            Filter filter = new Filter("create", goodsQo.getCreate());
            filter.setComparisonOperator(ComparisonOperator.GREATER_THAN);
            filter.setBooleanOperator(BooleanOperator.AND);
            filters.add(filter);
        }

        return pagesService.findAll(Goods.class, pageable, filters);
    }
}

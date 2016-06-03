package com.test.webapp.controller;

import com.test.neo4j.domain.Goods;
import com.test.neo4j.model.GoodsQo;
import com.test.neo4j.service.GoodsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;

@Controller
@RequestMapping("/goods")
public class GoodsController {
	private static Logger logger = LoggerFactory.getLogger(GoodsController.class);

	@Autowired
	private GoodsService goodsService;

	@RequestMapping("/index")
	public String getAll() throws Exception{
		return "goods/index";
	}

	@RequestMapping(value = "/list")
	@ResponseBody
	public Page<Goods> getData(GoodsQo goodsQo) {
		return goodsService.findPage(goodsQo);
	}

	@RequestMapping(value="/{id}")
	public String show(ModelMap model,@PathVariable Long id) {
		Goods goods = goodsService.findById(id);
		model.addAttribute("goods",goods);
		return "goods/show";
	}

	@RequestMapping("/new")
	public String create(ModelMap model,Goods goods){
		model.addAttribute("goods", goods);
		return "goods/new";
	}

	@RequestMapping(value="/save", method = RequestMethod.POST)
	@ResponseBody
	public String save(Goods goods) throws Exception{
		goods.setCreate(new Date());
		goods.setShopid(1L);
		goodsService.create(goods);
		logger.info("新增->ID="+goods.getId());
		return "1";
	}

	@RequestMapping(value="/edit/{id}")
	public String update(ModelMap model,@PathVariable Long id){
		Goods goods = goodsService.findById(id);
		model.addAttribute("goods",goods);
		return "goods/edit";
	}

	@RequestMapping(method = RequestMethod.POST, value="/update")
	@ResponseBody
	public String update(Goods goods) throws Exception{
		goodsService.update(goods);
		logger.info("修改->ID=" + goods.getId());
		return "1";
	}

	@RequestMapping(value="/delete/{id}",method = RequestMethod.GET)
	@ResponseBody
	public String delete(@PathVariable Long id) throws Exception{
		goodsService.delete(id);
		logger.info("删除->ID="+id);
		return "1";
	}

}

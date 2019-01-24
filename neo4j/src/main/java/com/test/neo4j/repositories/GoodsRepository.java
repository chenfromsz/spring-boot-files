package com.test.neo4j.repositories;

import com.test.neo4j.domain.Goods;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoodsRepository extends Neo4jRepository<Goods, Long> {
}

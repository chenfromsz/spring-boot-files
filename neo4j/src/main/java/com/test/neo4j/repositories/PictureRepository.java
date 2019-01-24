package com.test.neo4j.repositories;

import com.test.neo4j.domain.Picture;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PictureRepository extends Neo4jRepository<Picture, Long> {
    Picture findByFileName(String fileName);
}

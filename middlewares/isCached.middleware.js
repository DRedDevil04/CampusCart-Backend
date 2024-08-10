const cacheMiddleware = async (req, res, next) => {
    const { id } = req.params;
  
    redisClient.get(`item:${id}`, async (err, cachedData) => {
      if (err) {
        return next(err);
      }
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      
    });
  };
  
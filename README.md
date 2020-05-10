# reactVideo

1. ### 使用方法

   前提是需要一个后端服务,提供的API有:

   1).获取视频列表

   接口定义:

   ``

   ```java
   @GetMapping("/list/page")
   @ApiOperation("获取视频列表")
   public PageResultVO<MovieVO> getVideo(@Validated PageForm form) {
       return moviveService.getList(form);
   }
   ```

   返回值:

   ``

   ```
   @Data
   public class MovieVO  implements Serializable {
   
       private Long id;
       private String url;
       // gif的地址
       private String image;
       private String name;
       private Double size;
       private String rate;
       private Date gmtCreate;
       private Date gmtModified;
       private Boolean deleteFlag;
   
   }
   ```

   2).获取指定视频:

   ``

   ```java
   @GetMapping("/{id}")
   @ApiOperation("获取指定的视频")
   public Movie id(@PathVariable("id") Long id) {
       return movieMapper.selectById(id);
   }
   ```

   3).对视频平分

   ``

   ```java
   @PostMapping("/rate")
   @ApiOperation("对视频平分")
   public void rate(@RequestBody VideoForm form) {
       moviveService.rate(form);
   }
   ```

   修改commonDate中的服务端ip

   ### 2.部署

   支持docker部署:

   DockerFile:

   ```
   # The FROM instruction sets the Base Image for subsequent instructions.
   # Using Nginx as Base Image
   FROM node:8
   MAINTAINER ****@qq.com
   RUN mkdir /app
   WORKDIR /app
   COPY . /app/
   # The RUN instruction will execute any commands
   # Adding HelloWorld page into Nginx server
   RUN npm install
   
   # The EXPOSE instruction informs Docker that the container listens on the specified network ports at runtime
   EXPOSE 3000
   
   # The CMD instruction provides default execution command for an container
   # Start Nginx and keep it from running background
   CMD npm start
   ```

   部署好后,访问ip:3000即可
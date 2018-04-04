    /**
     * 获得base64
     * @param {Object} obj
     * @param {Number} [obj.width] 图片需要压缩的宽度，高度会跟随调整
     * @param {Number} [obj.quality=0.8] 压缩质量，不压缩为1
     * @param {Function} [obj.before(this, blob, file)] 处理前函数,this指向的是input:file
     * @param {Function} obj.success(obj) 处理后函数
     * @example
     *
     */
    $.fn.localResizeIMG = function (obj) {
        this.on('change', function () {
            var file = this.files[0];
            var URL = URL || webkitURL;
            var blob = URL.createObjectURL(file);
           
            // 执行前函数
            if($.isFunction(obj.before)) { obj.before(this, blob, file) };

            _create(blob, file);
            this.value = '';   // 清空临时数据
        });

        /**
         * 生成base64
         * @param blob 通过file获得的二进制
         */
        function _create(blob) {
            var img = new Image();
            img.src = blob;

            img.onload = function () {
                var that = this;

                //生成比例
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = obj.width || w;
                h = w / scale;

                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                $(canvas).attr({width : w, height : h});
                ctx.drawImage(that, 0, 0, w, h);

                /**
                 * 生成base64
                 * 兼容修复移动设备需要引入mobileBUGFix.js
                 */
                var base64 = canvas.toDataURL('image/jpeg', obj.quality || 0.8 );

                // 修复IOS
                if( navigator.userAgent.match(/iphone/i) ) {
                    var mpImg = new MegaPixImage(img);
                    mpImg.render(canvas, { maxWidth: w, maxHeight: h, quality: obj.quality || 0.8});
                    base64 = canvas.toDataURL('image/jpeg', obj.quality || 0.8 );
                }

                // 修复android
                if( navigator.userAgent.match(/Android/i) ) {
                    var encoder = new JPEGEncoder();
                    base64 = encoder.encode(ctx.getImageData(0,0,w,h), obj.quality * 100 || 80 );
                }

                // 生成结果
                var result = {
                    base64 : base64,
                    clearBase64: base64.substr( base64.indexOf(',') + 1 )
                };

                // 执行后函数
                obj.success(result);
            };
        }
    };
  //获取照片的元信息（拍摄方向）
    function getPhotoOrientation(img) {
      var orient;
      EXIF.getData(img, function() {
    	EXIF.getAllTags(this);
        orient = EXIF.getTag(this, 'Orientation');
      });
      return orient;
    }
    
  //绘制照片
    function drawPhoto(photo, x, y, w, h) {

      //获取照片的拍摄方向
      var orient = getPhotoOrientation(photo);
      alert("orient2:" + orient);

      var canvas = document.createElement("canvas");
     
      var ctx = canvas.getContext("2d");

        //draw on Canvas
        var img = new Image();
        img.onload = function() {

          var canvas_w = Number(ctx.canvas.width);
          var canvas_h = Number(ctx.canvas.height);

          //判断图片拍摄方向是否旋转了90度
          if (orient == 6) {
            ctx.save(); //保存状态
            ctx.translate(canvas_w / 2, canvas_h / 2); //设置画布上的(0,0)位置，也就是旋转的中心点
            ctx.rotate(90 * Math.PI / 180); //把画布旋转90度
            // 执行Canvas的drawImage语句
            ctx.drawImage(img, Number(y) - canvas_h / 2, Number(x) - canvas_w / 2, h, w); //把图片绘制在画布translate之前的中心点，
            ctx.restore(); //恢复状态
          } else {
            // 执行Canvas的drawImage语句
            ctx.drawImage(img, x, y, w, h);
          }

        }
        img.src = photo.src; // 设置图片源地址
      
    }

    // 例子
/*
    $('input:file').localResizeIMG({
        width: 100,
        quality: 0.1,
        //before: function (that, blob) {},
        success: function (result) {
            var img = new Image();
            img.src = result.base64;

            $('body').append(img);
            console.log(result);
        }
    });
*/
    function selectFileImage(fileObj) {  
        var file = fileObj.files['0'];  
        //图片方向角 added by lzk  
        var Orientation = null;  
          
        if (file) {  
            console.log("正在上传,请稍后...");  
            var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式  
            if (!rFilter.test(file.type)) {  
                //showMyTips("请选择jpeg、png格式的图片", false);  
                return;  
            }  
            // var URL = URL || webkitURL;  
            //获取照片方向角属性，用户旋转控制  
            EXIF.getData(file, function() {  
               // alert(EXIF.pretty(this));  
                EXIF.getAllTags(this);   
                //alert(EXIF.getTag(this, 'Orientation'));   
                Orientation = EXIF.getTag(this, 'Orientation');  
                //return;  
            });  
              
            var oReader = new FileReader();  
            oReader.onload = function(e) {  
                //var blob = URL.createObjectURL(file);  
                //_compress(blob, file, basePath);  
                var image = new Image();  
                image.src = e.target.result;  
               var that= {width:500};
                image.onload = function() {  
//                    var expectWidth = 500;  
//                    var expectHeight = this.naturalHeight;  
                 // 默认按比例压缩
                    var w = this.width,
                     h = this.height,
                     scale = w / h;
                     w = that.width || w;
                     h = that.height || (w / scale);
//                    if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 500) {  
//                        expectWidth = 500;  
//                        expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;  
//                    } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {  
//                        expectHeight = 800;  
//                        expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;  
//                    }  
                    var canvas = document.createElement("canvas");  
                    var ctx = canvas.getContext("2d");  
                    canvas.width = w;  
                    canvas.height = h;  

                    $(canvas).attr({width : w, height : h});
                    ctx.drawImage(this, 0, 0, w, h);  
                    var base64 = null;  
                    //修复ios  
                    if (navigator.userAgent.match(/iphone/i)) {  
                        console.log('iphone');  
                        //alert(expectWidth + ',' + expectHeight);  
                        //如果方向角不为1，都需要进行旋转 added by lzk  
                        if(Orientation != "" && Orientation != 1){  
                           
                            switch(Orientation){  
                                case 6://需要顺时针（向左）90度旋转  
                                    //alert('需要顺时针（向左）90度旋转');  
                                    //rotateImg(this,'left',canvas);  
                                	ctx.save(); //保存状态
                                    ctx.translate(w / 2, h / 2); //设置画布上的(0,0)位置，也就是旋转的中心点
                                    ctx.rotate(90 * Math.PI / 180); //把画布旋转90度
                                    // 执行Canvas的drawImage语句
                                    ctx.drawImage(image, Number(0) - h / 2, Number(0) - w / 2, h, w); //把图片绘制在画布translate之前的中心点，
                                    ctx.restore(); //恢复状态
                                    break;  
                                case 8://需要逆时针（向右）90度旋转  
                                    //alert('需要顺时针（向右）90度旋转');  
                                    rotateImg(this,'right',canvas);  
                                    break;  
                                case 3://需要180度旋转  
                                    //alert('需要180度旋转');  
                                    rotateImg(this,'right',canvas);//转两次  
                                    rotateImg(this,'right',canvas);  
                                    break;  
                            }         
                        }  
                          
                        /*var mpImg = new MegaPixImage(image); 
                        mpImg.render(canvas, { 
                            maxWidth: 800, 
                            maxHeight: 1200, 
                            quality: 0.8, 
                            orientation: 8 
                        });*/  
                        base64 = canvas.toDataURL("image/jpeg", 0.8);  
                    }else if (navigator.userAgent.match(/Android/i)) {// 修复android  
                        var encoder = new JPEGEncoder();  
                        base64 = encoder.encode(ctx.getImageData(0, 0, expectWidth, expectHeight), 80);  
                    }else{  
                        //alert(Orientation);  
                        if(Orientation != "" && Orientation != 1){  
                            //alert('旋转处理');  
                            switch(Orientation){  
                                case 6://需要顺时针（向左）90度旋转  
                                    alert('需要顺时针（向左）90度旋转');  
//                                    rotateImg(this,'left',canvas);  
                                    ctx.save(); //保存状态
                                    ctx.translate(w / 2, h / 2); //设置画布上的(0,0)位置，也就是旋转的中心点
                                    ctx.rotate(90 * Math.PI / 180); //把画布旋转90度
                                    // 执行Canvas的drawImage语句
                                    ctx.drawImage(image, Number(0) - h / 2, Number(0) - w / 2, h, w); //把图片绘制在画布translate之前的中心点，
                                    ctx.restore(); //恢复状态
                                    break;  
                                case 8://需要逆时针（向右）90度旋转  
                                    alert('需要顺时针（向右）90度旋转');  
                                    rotateImg(this,'right',canvas);  
                                    break;  
                                case 3://需要180度旋转  
                                    alert('需要180度旋转');  
                                    rotateImg(this,'right',canvas);//转两次  
                                    rotateImg(this,'right',canvas);  
                                    break;  
                            }         
                        }  
                           
                        base64 = canvas.toDataURL("image/jpeg", 0.8);  
                    }  
                    //uploadImage(base64);  
                    $("#myImage").attr("src", base64); 

                    $.ajax({
    	                async:false,//是否异步  
    	                cache:false,//是否使用缓存
    	                dataType: "json",
    	                url: basePath+"MyExam!uploadImg.action",
    					type: "POST",
    					data:{formFile:base64,uceId:$("#uceId").val(),queId:$("#queId").val()},
    					contentType : 'application/x-www-form-urlencoded; charset=utf-8', 
    					timeout: 1000,
    					error: function(){
    						alert("Error loading document");
    					},
    					 success: function(result){
    					 	//alert(result);
    						//console.log(result);
    						alert("Uploads success~");
    					}
    				}); 
                };  
            };  
            oReader.readAsDataURL(file);  
        }  
    }  
      
    //对图片旋转处理 added by lzk  
    function rotateImg(img, direction,canvas) {    
            //alert(img);  
            //最小与最大旋转方向，图片旋转4次后回到原方向    
            var min_step = 0;    
            var max_step = 3;    
            //var img = document.getElementById(pid);    
            if (img == null)return;    
            //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
            var height = img.height;    
            var width = img.width;    
            //var step = img.getAttribute('step');    
            var step = 2;    
            if (step == null) {    
                step = min_step;    
            }    
            if (direction == 'right') {    
                step++;    
                //旋转到原位置，即超过最大值    
                step > max_step && (step = min_step);    
            } else {    
                step--;    
                step < min_step && (step = max_step);    
            }    
            //img.setAttribute('step', step);    
            /*var canvas = document.getElementById('pic_' + pid);   
            if (canvas == null) {   
                img.style.display = 'none';   
                canvas = document.createElement('canvas');   
                canvas.setAttribute('id', 'pic_' + pid);   
                img.parentNode.appendChild(canvas);   
            }  */  
            //旋转角度以弧度值为参数    
            var degree = step * 90 * Math.PI / 180;    
            var ctx = canvas.getContext('2d');    
            switch (step) {    
                case 0:    
                    canvas.width = width;    
                    canvas.height = height;    
                    ctx.drawImage(img, 0, 0);    
                    break;    
                case 1:    
                    canvas.width = height;    
                    canvas.height = width;    
                    ctx.rotate(degree);    
                    ctx.drawImage(img, 0, -height);    
                    break;    
                case 2:    
                    canvas.width = width;    
                    canvas.height = height;    
                    ctx.rotate(degree);    
                    ctx.drawImage(img, -width, -height);    
                    break;    
                case 3:    
                    canvas.width = height;    
                    canvas.height = width;    
                    ctx.rotate(degree);    
                    ctx.drawImage(img, -width, 0);    
                    break;    
            }    
        }    
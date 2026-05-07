*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial;
}

body{
  background:White(#EAEAEA);
  padding:40px;
}

.container{
  max-width:900px;
  margin:auto;
}


.header{
  margin-bottom:30px;
}

.header h1{
  color:violet(#8E44AD);
  margin-bottom:10px;
}


.feedback-card{
  background:violet(#8E44AD);;
  padding:30px;
  border-radius:15px;
  box-shadow:0;
  margin-bottom:30px;
}


.user-info{
  display:flex;
  align-items:center;
  gap:20px;
  margin-bottom:30px;
}

.user-info img{
  width:80px;
  height:80px;
  border-radius:50%;
}


.rating-section{
  margin-bottom:30px;
}

.stars{
  margin-top:15px;
}

.star{
  font-size:40px;
  cursor:pointer;
  color:violet(#8E44AD);;
  transition:0.3s;
}

.star.active{
  color:violet(#8E44AD);
}


#ratingText{
  margin-top:10px;
  font-size:18px;
  color:violet(#8E44AD);
}


textarea{
  width:100%;
  height:140px;
  border:1px violet(#8E44AD) ;
  border-radius:10px;
  padding:15px;
  margin-top:15px;
  resize:none;
  font-size:16px;
}


button{
  margin-top:25px;
  width:100%;
  padding:15px;
  border:none;
  background:violet(#8E44AD);
  color:violet(#8E44AD);;
  border-radius:10px;
  cursor:pointer;
  font-size:16px;
}

button:hover{
  background:violet(#8E44AD);
}


.reviews-section{
  background:White(#EAEAEA);
  padding:30px;
  border-radius:15px;
  box-shadow:violet(#8E44AD);
}

.reviews-section h2{
  margin-bottom:20px;
}

.review-box{
  border-bottom:1px solid ;
  padding:20px 0;
}

.review-top{
  display:flex;
  align-items:center;
  gap:15px;
  margin-bottom:10px;
}

.review-top img{
  width:60px;
  height:60px;
  border-radius:50%;
}

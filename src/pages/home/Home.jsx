import React, { useEffect, useState } from 'react';
import FollowSuggetion from './FollowSuggetion';
import TopStory from './TopStory';
import useWidth from '../../Hooks/useWidth';
import HomeCard from '../../components/HomeCard/HomeCard';
import axios from 'axios';
import { Spinner, useSelect } from "@material-tailwind/react";
import { useSelector } from 'react-redux';


const Home = () => {
  const { width, breakpoints } = useWidth();
  const [postsArr, setPostArr] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const state = useSelector((state) => state);


  const fetchPosts = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=10&page=${page}`);

      if (response && response.data.length > 0) {
        setPostArr(prevPosts => [...prevPosts, ...response.data]);
        if (response.data.length < 10) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error in fetching posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleInfiniteScroll = () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;


    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    scrollContainer.addEventListener("scroll", handleInfiniteScroll);
    
    return () => scrollContainer.removeEventListener("scroll", handleInfiniteScroll);
  }, [hasMore, loading]);

  return (
    <div className='scroll-container w-[100%] flex ' style={{height:"100vh", overflowY: "auto"}} >
      {/* <div className={`${width > breakpoints.xl ? "w-[60%]" : "w-[100%]"}`}>
        <TopStory />
        <div className='flex flex-col items-center  py-2 justify-center'>
          <div className={`${width < breakpoints.sm ? "w-[100%]" : "w-[60%]"} flex flex-col justify-center gap-3 items-center`}>
            {postsArr.length > 0 ? postsArr.map((item, index) => (
              <HomeCard key={index} item={item} />
            )) : <div>No posts found.</div>}
            {loading && (
              <div className="flex justify-center my-4">
                <Spinner className="h-8 w-8"/>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`${width > breakpoints.xl ? "w-[40%]" : "w-[0%] hidden"}`}>
        <FollowSuggetion />
      </div> */}
    </div>
  );
}

export default Home;

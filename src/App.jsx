import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

function App() {
    const [title, setTitle] = useState('');
    const [view, setView] = useState(0);
    const queryClient = useQueryClient();

    const getPosts = async () => {
        const response = await axios.get('http://localhost:4000/posts');
        return response.data;
    };
  
      const getProfile = async () => {
          const response = await axios.get('http://localhost:4000/profile');
          return response.data;
      };

    const {
        data: postDataaa,
        isError,
        isLoading,
    } = useQuery({
        queryKey: ['posts'],
        queryFn: getPosts,
    });
  
      const {
          data: profileDataaa,
      } = useQuery({
          queryKey: ['posts'],
          queryFn: getProfile,
      });

    const addPost = async (newData) => {
        await axios.post('http://localhost:4000/posts', {
            title: newData.title,
            view: newData.view,
        });
    };

    const mutation = useMutation({
        mutationFn: addPost,
        onSuccess: () => {
            queryClient.invalidateQueries(['posts']); //이부분도사실좀참고했다......
        },
    });

    if (isLoading) {
        return <div>로딩중입니다...</div>;
    }

    if (isError) {
        return <div>오류가 발생하였습니다...</div>;
    }

    return (
        <div>
            <input value={title} placeholder="title" onChange={(e) => setTitle(e.target.value)} />
            <input value={view} placeholder="view" onChange={(e) => setView(e.target.value)} />
            <button
                onClick={() => {
                    mutation.mutate({
                        //여기에 화살표함수 넣었어야한다................. 무섭다,............
                        title: title,
                        view: view,
                    });
                }}
            >
                제출
            </button>
            {postDataaa.map((post) => {
                return (
                    //여기리턴도 좀 참고했다.........
                    <div>
                        <p>
                            {post.title} {post.view}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default App;

import Post from '@/components/Post'
import Header from '@/components/Header'
export const metadata={
    title:"Post",
}

export default function PostPage({params}) {
       
       return(
        <>
        <Header/>
        <Post params={params}/>
        </> 
    ) 
};
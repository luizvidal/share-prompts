import PromptCard from "./PromptCard";

const Profile: any = ({ name, desc, data, handleEdit, handleDelete }) => (
	<section className="w-full">
		<h1 className="head_text text-left">
			<span className="blue_gradient">{name} Profile</span>
			<p className="desc text-left">{desc}</p>
		</h1>

		<div className="mt-10 prompt_layout">
			{data.map((post: any) => (
				<PromptCard
					key={post._id}
					post={post}
					handleEdit={() => handleEdit && handleEdit(post)}
					handleDelete={() => handleDelete && handleDelete(post)}
				/>
			))}
		</div>
	</section>
);

export default Profile;

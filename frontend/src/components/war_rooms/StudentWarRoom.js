import React from 'react';
import ActiveProjectsList from './ActiveProjectsList';
import MyProjectsList from './MyProjectsList'; 
import ClaimChallengeList from './ClaimChallengeList';

export default function StudentWarRoom() {
  return (
    <div>
      <h1>Student War Room</h1>
      <p>
        Welcome! Here you can see the projects you've joined and find new projects to contribute to.
      </p>
      <hr />
      <MyProjectsList />
      <ClaimChallengeList />
      <hr style={{ margin: '40px 0' }}/>
      <ActiveProjectsList />
    </div>
  );
}
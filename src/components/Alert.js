import React from 'react';
import './Alert.css';

function Alert(props) {
  return (
    <div>
      <div className="mybox success">
				<div className="mybox-content">
					<p>
						{props.message}
					</p>
				</div>
			</div>
    </div>
  );
}

export default Alert;

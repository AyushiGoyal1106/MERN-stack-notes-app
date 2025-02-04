import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import { pink_notes } from "../../assets/images";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

function Home() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(null);
  const [deleteId, setdeleteId] = useState(null);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:4500/");
      setData(response.data);
    } catch (error) {
      console.error("Error getting users:", error);
    }
  };
  const titleRef = useRef();
  const contentRef = useRef();

  const handleClose = () => {
    setShow(false);
    setUpdateData(null);
    setUpdateData(null);
  };

  const handleSubmit = async () => {
    setShow(false);
    const notesData = {
      title: titleRef.current.value,
      content: contentRef.current.value,
    };
    try {
      const response = await axios.post(
        "http://localhost:4500/send",
        JSON.stringify(notesData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        console.log(response);
        getData();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  const calldelete = (elem) => {
    setdeleteId(elem._id);
    setShow(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:4500/${deleteId}`);
      console.log(response);
      if (response) {
        getData();
        setShow(null);
        setUpdateData(null);
        setdeleteId(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (values) => {
    setUpdateData(values);
    setShow(true);
  };

  const updateFun = async () => {
    if (updateData.title !== "") {
      const notesData = {
        title: updateData.title,
        content: updateData.content,
      };
      try {
        const response = await axios.put(
          `http://localhost:4500/${updateData._id}`,
          JSON.stringify(notesData),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response) {
          console.log(response);
        }
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
    setUpdateData(null);
    setShow(false);
    getData();
  };

  return (
    <div className="homeContainer">
      <div className="homeContentCont">
        <div className="d-flex">
          <img src={pink_notes} alt="" className="notesImg" />
          <div className="heading">Notes</div>
        </div>
        <div className="createNoteDiv">
          <button className="createNoteBtn" onClick={() => setShow(true)}>
            Create Notes
          </button>
        </div>
        {data.length !== 0 && (
          <>
            {data.map((elem, index) => (
              <div className="notesContainer" key={elem._id}>
                <div className="notesTitle">{elem.title}:</div>
                {elem.content && (
                  <div className="notesContent">
                    {elem.content.length > 405
                      ? `${elem.content.slice(0, 400)}...${elem.content.slice(
                          elem.content.length - 4,
                          elem.content.length
                        )}`
                      : elem.content}
                  </div>
                )}

                <div className="notesIcon">
                  <EditIcon
                    sx={{ color: "gray" }}
                    onClick={() => handleUpdate(elem)}
                  />
                  <DeleteIcon
                    sx={{ color: "gray" }}
                    onClick={() => calldelete(elem)}
                  />
                </div>
              </div>
            ))}
          </>
        )}
        {data.length == 0 && <div className="noData">No Data Found</div>}
      </div>

      {show && updateData === null && !deleteId && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Notes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                  ref={titleRef}
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control as="textarea" rows={3} ref={contentRef} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSubmit()}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {updateData !== null && show && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Notes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                  autoComplete="off"
                  value={updateData.title}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      title: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={updateData.content}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      content: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => updateFun()}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {deleteId && show && (
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Body>Are You sure you want to delete this?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
            <Button variant="danger" onClick={() => handleDelete()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Home;

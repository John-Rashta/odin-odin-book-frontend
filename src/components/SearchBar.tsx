import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchUsersInfiniteQuery } from "../features/book-api/book-api-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import { ClickType } from "../../util/types";
import MiniUser from "./MiniUser";
import styled from "styled-components";
import { clickClass } from "../../util/globalValues";

export default function SearchBar({className} : {className?: string}) {
    const { pathname } = useLocation();
    const [searchValue, setSearchValue] = useState("");
    const { searchData } = useSearchUsersInfiniteQuery(searchValue !== "" ? searchValue : skipToken, {
        selectFromResult: (result) => ({
            ...result,
                searchData: result.data?.pages.map(({users}) => users).flat()
        })
    });
    const navigate = useNavigate();
    const handleClick = function handleClickingSearchResult(event: ClickType) {
        const target = event.target as HTMLElement;
        const realTarget = target.closest(".searchResult");
        if (!realTarget || !(realTarget instanceof HTMLElement)) {
          return;
        }
        const possibleUser = realTarget.dataset.userid;
        if (!possibleUser) {
          return;
        }
    
        setSearchValue("");
        navigate(`/user?id=${possibleUser}`);
    };
    return (
        <>
            { pathname !== "/search"  &&
                <div className={`${clickClass} ${className || ""}`} style={{position: "relative"}}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        setSearchValue("");
                        navigate(`/search?user=${searchValue}`);
                        return;
                    }}>
                        <StyledInput 
                            type="text"
                            name="searchBar"
                            id="searchBar"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }}
                        />
                    </form>
                    {
                        (searchData && searchValue !== "") && (
                            <StyledSearchResult onClick={handleClick}>
                                {
                                    (searchData.length > 0) ? searchData.map((ele) => {
                                        return <MiniUser key={ele.id} user={ele} />
                                    }) : <StyledNoResults>
                                        No Results Found
                                    </StyledNoResults>
                                }
                            </StyledSearchResult>
                        )
                    }
                </div>
            }
        </>
    )
};

const StyledInput = styled.input`
  padding: 7px;
  background-color: rgb(255, 255, 255);
  border: 1px solid black;
  font-size: 1rem;
`;

const StyledSearchResult = styled.div`
  border: 1px solid black;
  position: absolute;
  background-color: rgb(255, 255, 255);
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
`;

const StyledNoResults = styled.div`
  padding: 10px;
`;
